import { NextResponse } from "next/server";
import { GraphQLClient, gql } from "graphql-request";
import { currentUser } from "@clerk/nextjs/server";

const HYGRAPH_CONTENT_API_URL = process.env.HYGRAPH_CONTENT_API_URL || "https://api-ap-south-1.hygraph.com/v2/cmeprfwik05nl07usg5gwvtl7/master";
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN;

export async function POST(request: Request) {
  try {
    if (!HYGRAPH_TOKEN) {
      return NextResponse.json({ error: "Server is missing HYGRAPH_TOKEN" }, { status: 500 });
    }

    const body = await request.json();

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const computedUserName = [user.firstName, user.lastName].filter(Boolean).join(" ");
    const primaryEmail = Array.isArray(user.emailAddresses)
      ? user.emailAddresses.find((e: any) => e.id === user.primaryEmailAddressId)?.emailAddress
      : undefined;
    const providedUserNameRaw = typeof body?.userName === 'string' ? body.userName : '';
    const providedUserName = providedUserNameRaw.trim();
    const finalUserName = providedUserName || computedUserName || user.username || primaryEmail || "";
    if (!finalUserName) {
      return NextResponse.json({ error: "Missing userName" }, { status: 400 });
    }

    const writeClient = new GraphQLClient(HYGRAPH_CONTENT_API_URL, {
      headers: { Authorization: `Bearer ${HYGRAPH_TOKEN}` },
    });

    const CREATE_MUTATION = gql`
      mutation CreateBooking($data: BookingCreateInput!) {
        createBooking(data: $data) { id }
      }
    `;

    const data = {
      carId: { connect: { id: body.carId } },
      userName: finalUserName,
      contactNumber: body.contactNumber,
      dropOffDate: body.dropOffDate,
      dropOffTime: body.dropOffTime,
      location: body.location,
      pickUpDate: body.pickUpDate,
      pickUpTime: body.pickUpTime,
      bookingStatus: 'approved',
      email: String(body?.email || ""),
    };

    const createRes: any = await writeClient.request(CREATE_MUTATION, { data });
    const bookingId = createRes?.createBooking?.id;

    const PUBLISH_MUTATION = gql`
      mutation PublishBooking($id: ID!) {
        publishBooking(where: { id: $id }) { id }
      }
    `;

    const publishRes: any = await writeClient.request(PUBLISH_MUTATION, { id: bookingId });

    return NextResponse.json({ id: bookingId, published: publishRes?.publishBooking?.id });
  } catch (error: any) {
    return NextResponse.json({ error: error?.response || error?.message || "Unknown error" }, { status: 500 });
  }
}


