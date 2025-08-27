export default function Loading() {
  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 bg-white h-32" />
        ))}
      </div>
    </div>
  )
}


