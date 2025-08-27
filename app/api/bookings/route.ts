import { NextResponse } from "next/server";
import { GraphQLClient, gql } from "graphql-request";

const HYGRAPH_CONTENT_API_URL = process.env.HYGRAPH_CONTENT_API_URL || "https://api-ap-south-1.hygraph.com/v2/cmeprfwik05nl07usg5gwvtl7/master";
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN;

export async function POST(request: Request) {
  try {
    if (!HYGRAPH_TOKEN) {
      return NextResponse.json({ error: "Server is missing HYGRAPH_TOKEN" }, { status: 500 });
    }

    const body = await request.json();

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
      userName: body.userName,
      contactNumber: body.contactNumber,
      dropOffDate: body.dropOffDate,
      dropOffTime: body.dropOffTime,
      location: body.location,
      pickUpDate: body.pickUpDate,
      pickUpTime: body.pickUpTime,
      bookingStatus: 'pending',
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


