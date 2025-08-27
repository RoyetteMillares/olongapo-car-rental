"use client"
import { useState } from "react"
import { BOOKING_STATUSES, BookingStatus } from "@/types"
import toast from "react-hot-toast"

export default function AdminStatusControl({ id, status }: { id: string; status: BookingStatus }) {
  const [current, setCurrent] = useState<BookingStatus>(status)
  const [loading, setLoading] = useState(false)

  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as BookingStatus
    if (next === current) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingStatus: next }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      setCurrent(next)
      toast.success('Status updated')
    } catch (e: any) {
      toast.error(e?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <select className="select select-sm select-bordered uppercase"
      value={current}
      onChange={onChange}
      disabled={loading}
      aria-label="Booking status">
      {BOOKING_STATUSES.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}


