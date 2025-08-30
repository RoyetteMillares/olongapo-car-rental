import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GraphQLClient, gql } from "graphql-request";

const HYGRAPH_CDN_URL = process.env.NEXT_PUBLIC_HYGRAPH_CDN_URL || "https://ap-south-1.cdn.hygraph.com/content/cmeprfwik05nl07usg5gwvtl7/master";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
    const username = user.username || "";
    const primaryEmail = Array.isArray(user.emailAddresses)
      ? user.emailAddresses.find((e: any) => e.id === user.primaryEmailAddressId)?.emailAddress
      : undefined;
    const names = Array.from(new Set([fullName, username, primaryEmail].filter(Boolean))) as string[];
    if (!names.length) return NextResponse.json({ error: "Missing user identifiers" }, { status: 400 });

    const readClient = new GraphQLClient(HYGRAPH_CDN_URL);
    const QUERY = gql`
      query MyQuery($names: [String!]) {
        bookings(where: { userName_in: $names }, orderBy: createdAt_DESC) {
          createdAt
          id
          userName
          contactNumber
          dropOffTime
          dropOffDate
          pickUpDate
          location
          pickUpTime
          bookingStatus
        }
      }
    `;

    const data = await readClient.request(QUERY, { names });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json().catch(() => ({} as any));
    const providedUserName = (body?.userName as string | undefined)?.trim();
    const user = await currentUser();
    const fullName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : "";
    const username = user?.username || "";
    const primaryEmail = user && Array.isArray(user.emailAddresses)
      ? user.emailAddresses.find((e: any) => e.id === user.primaryEmailAddressId)?.emailAddress
      : undefined;
    const names = Array.from(new Set([providedUserName, fullName, username, primaryEmail].filter(Boolean))) as string[];
    if (!names.length) return NextResponse.json({ error: "user identifiers are required" }, { status: 400 });

    const readClient = new GraphQLClient(HYGRAPH_CDN_URL);
    const QUERY = gql`
      query MyQuery($names: [String!]) {
        bookings(where: { userName_in: $names }, orderBy: createdAt_DESC) {
          createdAt
          id
          userName
          contactNumber
          dropOffTime
          dropOffDate
          pickUpDate
          location
          pickUpTime
          bookingStatus
        }
      }
    `;

    const data = await readClient.request(QUERY, { names });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.response || error?.message || "Unknown error" }, { status: 500 });
  }
}


