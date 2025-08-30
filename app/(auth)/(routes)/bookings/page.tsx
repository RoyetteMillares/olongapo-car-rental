"use client";

import useSWR from "swr";
import BookingCard from "@/components/BookingCard";
import useModalStore from "@/store";
import { useEffect } from "react";

const fetcher = async (url: string) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
};

export default function Page() {
  const { lastBookedCarId, setLastBookedCarId } = useModalStore();
  const { lastBookedId, setLastBookedId } = useModalStore();
  const key = lastBookedId ? `/api/bookings/mine?id=${lastBookedId}` : "/api/bookings/mine";
  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 5000,
  });

  useEffect(() => {
    if (lastBookedCarId || lastBookedId) {
      mutate();
      setLastBookedCarId(null);
      if (lastBookedId) setLastBookedId(null);
    }
  }, [lastBookedCarId, lastBookedId, mutate, setLastBookedCarId, setLastBookedId]);

  const bookings = data?.bookings || [];

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>
      {isLoading ? (
        <p className="text-gray-600">Loading your bookings…</p>
      ) : error ? (
        <p className="text-red-600">Couldn\'t load bookings.</p>
      ) : bookings.length === 0 ? (
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


