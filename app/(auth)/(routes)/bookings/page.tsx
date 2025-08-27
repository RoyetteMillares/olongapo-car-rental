import { currentUser } from "@clerk/nextjs/server";
import { GraphQLClient, gql } from "graphql-request";
import BookingCard from "@/components/BookingCard";

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  const HYGRAPH_CDN_URL = process.env.NEXT_PUBLIC_HYGRAPH_CDN_URL || "https://ap-south-1.cdn.hygraph.com/content/cmeprfwik05nl07usg5gwvtl7/master";
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
        bookingStatus
        carId { id name image { url } }
      }
    }
  `;
  const data: any = await readClient.request(QUERY, { userName });
  const bookings = data?.bookings || [];

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((b: any) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}


