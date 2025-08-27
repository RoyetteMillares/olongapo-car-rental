import { GraphQLClient, gql } from "graphql-request"
const HYGRAPH_CDN_URL =  "https://ap-south-1.cdn.hygraph.com/content/cmeprfwik05nl07usg5gwvtl7/master"
const HYGRAPH_CONTENT_API_URL = "https://api-ap-south-1.hygraph.com/v2/cmeprfwik05nl07usg5gwvtl7/master"
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN

const readClient = new GraphQLClient(HYGRAPH_CDN_URL)
const writeClient = new GraphQLClient(HYGRAPH_CONTENT_API_URL, {
  headers: HYGRAPH_TOKEN ? { Authorization: `Bearer ${HYGRAPH_TOKEN}` } : {}
})
export const getCarsList = async () => {
  const query = gql`
    query CarLists {
  carLists {
    carAvg
    createdAt
    id
    name
    price
    publishedAt
    updatedAt
    seat
    carType
    carBrand
    image {
      url
    }
  }
}
`
  const result = await readClient.request(query)
  return result
}

export const getStoreLocation = async () => {
  const query = gql
    `query MyQuery {
  storesLocations {
    address
  }
}
`
  const result = await readClient.request(query)
  return result
}



export const getCurrentlyBookedCarIds = async (): Promise<string[]> => {
  const query = gql`
    query ActiveBookings {
      bookings(first: 200, orderBy: createdAt_DESC) {
        pickUpDate
        dropOffDate
        carId { id }
      }
    }
  `
  const result: any = await readClient.request(query)
  const today = new Date()
  const ids: string[] = (result?.bookings || [])
    .filter((b: any) => {
      const start = new Date(`${b.pickUpDate}T00:00:00`)
      const end = new Date(`${b.dropOffDate}T23:59:59`)
      return !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && start <= today && today <= end
    })
    .map((b: any) => b?.carId?.id)
    .filter((id: any) => typeof id === 'string')
  return Array.from(new Set(ids))
}

export const createBooking = async (formValue: any) => {
  // Call server route so HYGRAPH_TOKEN stays on server
  const res = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formValue),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error ? JSON.stringify(err.error) : 'Failed to create booking')
  }
  return res.json()
}