import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { GraphQLClient, gql } from "graphql-request";
import Image from "next/image";
import AdminStatusControl from "./status-control";

export default async function AdminBookingsPage() {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
  const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase();
  if (!email || !adminEmails.includes(email)) return redirect("/");

  const HYGRAPH_CDN_URL = process.env.NEXT_PUBLIC_HYGRAPH_CDN_URL || "https://ap-south-1.cdn.hygraph.com/content/cmeprfwik05nl07usg5gwvtl7/master";
  const client = new GraphQLClient(HYGRAPH_CDN_URL);
  const QUERY = gql`
    query AdminBookings {
      bookings(orderBy: createdAt_DESC) {
        id
        createdAt
        userName
        contactNumber
        location
        pickUpDate
        pickUpTime
        dropOffDate
        dropOffTime
        bookingStatus
        carId { id name image { url } }
      }
    }
  `;
  const data: any = await client.request(QUERY);
  const bookings = data?.bookings || [];

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Admin • Bookings</h1>
        <div className="text-sm text-gray-500">Manage approvals and availability</div>
      </div>
      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Car</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Location</th>
                <th>Pickup</th>
                <th>Dropoff</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id} className="align-top">
                  <td>
                    <div className="flex items-center gap-2">
                      {b?.carId?.image?.url ? (
                        <div className="relative w-14 h-10">
                          <Image src={b.carId.image.url} alt={b?.carId?.name || 'Car'} fill className="object-cover rounded" />
                        </div>
                      ) : null}
                      <div>{b?.carId?.name || 'Car'}</div>
                    </div>
                  </td>
                  <td>{b.userName}</td>
                  <td>{b.contactNumber}</td>
                  <td>{b.location}</td>
                  <td>{b.pickUpDate} {b.pickUpTime}</td>
                  <td>{b.dropOffDate} {b.dropOffTime}</td>
                  <td className="uppercase text-xs font-semibold">
                    <AdminStatusControl id={b.id} status={b.bookingStatus || 'PENDING'} />
                  </td>
                  <td className="whitespace-nowrap">{new Date(b.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


