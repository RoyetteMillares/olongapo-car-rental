import request, { gql } from "graphql-request"

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
  const result = await request("https://api-ap-northeast-1.hygraph.com/v2/clqp5396btrvt01t8hg8n0dls/master", query)
  return result
}

export const getStoreLocation = async () => {
  const query = gql
    `query MyQuery {
  storeLocations {
    address
  }
}
`
  const result = await request("https://api-ap-northeast-1.hygraph.com/v2/clqp5396btrvt01t8hg8n0dls/master", query)
  return result
}



export const createBooking = async (formValue: any) => {
  const mutationQuery = gql`
mutation MyMutation {
  createBooking(
    data: 
    {
    carId: {connect: {id: "`+ formValue.carId + `"}}, 
    contactNumber: "`+ formValue.contactNumber + `",
    dropOffDate: "`+ formValue.dropOffDate + `", 
    dropOffTime: "`+ formValue.dropOffTime + `", 
    location: "`+ formValue.location + `", 
    pickUpDate: "`+ formValue.pickUpDate + `", 
    pickUpTime: "`+ formValue.pickUpTime + `", 
  }
  ) {
    id
  }
}

  `
  const result = await request("https://api-ap-northeast-1.hygraph.com/v2/clqp5396btrvt01t8hg8n0dls/master", mutationQuery)
  return result
}