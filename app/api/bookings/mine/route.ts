import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GraphQLClient, gql } from "graphql-request";

const HYGRAPH_CDN_URL = process.env.NEXT_PUBLIC_HYGRAPH_CDN_URL || "https://ap-south-1.cdn.hygraph.com/content/cmeprfwik05nl07usg5gwvtl7/master";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userName = [user.firstName, user.lastName].filter(Boolean).join(" ");
    if (!userName) return NextResponse.json({ error: "Missing userName" }, { status: 400 });

    const readClient = new GraphQLClient(HYGRAPH_CDN_URL);
    const QUERY = gql`
      query MyQuery($userName: String!) {
        bookings(where: { userName: $userName }, orderBy: createdAt_DESC) {
          createdAt
          id
          userName
          contactNumber
          dropOffTime
          dropOffDate
          pickUpDate
          location
          pickUpTime
        }
      }
    `;

    const data = await readClient.request(QUERY, { userName });
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
    const providedUserName = body?.userName as string | undefined;
    const user = await currentUser();
    const computedName = user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : "";
    const userName = providedUserName || computedName || "";
    if (!userName) return NextResponse.json({ error: "userName is required" }, { status: 400 });

    const readClient = new GraphQLClient(HYGRAPH_CDN_URL);
    const QUERY = gql`
      query MyQuery($userName: String!) {
        bookings(where: { userName: $userName }, orderBy: createdAt_DESC) {
          createdAt
          id
          userName
          contactNumber
          dropOffTime
          dropOffDate
          pickUpDate
          location
          pickUpTime
        }
      }
    `;

    const data = await readClient.request(QUERY, { userName });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.response || error?.message || "Unknown error" }, { status: 500 });
  }
}


