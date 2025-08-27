import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { GraphQLClient, gql } from "graphql-request"

const HYGRAPH_CONTENT_API_URL = process.env.HYGRAPH_CONTENT_API_URL || "https://api-ap-south-1.hygraph.com/v2/cmeprfwik05nl07usg5gwvtl7/master"
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN

export async function PUT(request: Request, context: any) {
  try {
    const { params } = context
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean)
    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase()
    if (!email || !adminEmails.includes(email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!HYGRAPH_TOKEN) {
      return NextResponse.json({ error: "Server is missing HYGRAPH_TOKEN" }, { status: 500 })
    }

    const { id } = params
    if (!id) return NextResponse.json({ error: "Missing booking id" }, { status: 400 })

    const body = await request.json().catch(() => ({}))
    const bookingStatusRaw = String(body?.bookingStatus || "")
    const bookingStatus = bookingStatusRaw.toLowerCase()
    if (!["pending", "approved", "cancelled"].includes(bookingStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const writeClient = new GraphQLClient(HYGRAPH_CONTENT_API_URL, {
      headers: { Authorization: `Bearer ${HYGRAPH_TOKEN}` },
    })

    const UPDATE = gql`
      mutation UpdateBookingStatus($id: ID!, $status: BookingStatus!) {
        updateBooking(where: { id: $id }, data: { bookingStatus: $status }) { id bookingStatus }
      }
    `
    const PUBLISH = gql`
      mutation PublishBooking($id: ID!) { publishBooking(where: { id: $id }) { id } }
    `

    const updateRes: any = await writeClient.request(UPDATE, { id, status: bookingStatus })
    await writeClient.request(PUBLISH, { id })

    return NextResponse.json({ id, bookingStatus: updateRes?.updateBooking?.bookingStatus || bookingStatus })
  } catch (error: any) {
    return NextResponse.json({ error: error?.response || error?.message || "Unknown error" }, { status: 500 })
  }
}


