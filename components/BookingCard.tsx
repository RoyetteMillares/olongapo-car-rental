"use client"
import Image from "next/image"

type Booking = {
  id: string
  location: string
  pickUpDate: string
  pickUpTime: string
  dropOffDate: string
  dropOffTime: string
  bookingStatus?: 'pending' | 'approved' | 'cancelled'
  carId?: { id: string; name?: string; image?: { url?: string } }
  carList?: { id: string; name?: string; image?: { url?: string } }
}

export default function BookingCard({ booking }: { booking: Booking }) {
  const car = booking?.carList || booking?.carId
  const imageUrl = car?.image?.url
  return (
    <div className="border rounded-lg p-4 bg-white flex gap-3">
      {imageUrl ? (
        <div className="relative w-24 h-16 shrink-0">
          <Image src={imageUrl} alt={car?.name || 'Car'} fill className="object-cover rounded" />
        </div>
      ) : null}
      <div className="flex-1">
        <div className="text-lg font-medium">{car?.name || 'Car'}</div>
        <div className="text-sm text-gray-600">{booking.location}</div>
        <div className="mt-2 text-sm grid grid-cols-1 gap-0.5">
          <div><span className="font-semibold">Pickup:</span> {booking.pickUpDate} {booking.pickUpTime}</div>
          <div><span className="font-semibold">Dropoff:</span> {booking.dropOffDate} {booking.dropOffTime}</div>
        </div>
        <div className="mt-2">
          <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-gray-100">
            {booking.bookingStatus || 'PENDING'}
          </span>
        </div>
      </div>
    </div>
  )
}


