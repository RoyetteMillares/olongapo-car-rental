"use client"
import { useEffect, useState } from "react"

function CarsFilterOption({ carsFilter, setBrand, orderCarList, clearFilters }: any) {
    const [brandList, setBrandList] = useState<any>()
    const [selectedBrand, setSelectedBrand] = useState<string>("")
    const [selectedPrice, setSelectedPrice] = useState<string>("")

    const BrandSet = new Set()

    useEffect(() => {
        if (carsFilter) {
            filterCarList()
        }
    }, [carsFilter])
    const filterCarList = () => {
        carsFilter.forEach((element: any) => {
            BrandSet.add(element.carBrand)
        })
        setBrandList(Array.from(BrandSet))
    }
    return (
        <section className="mt-10 p-4 flex flex-col md:flex-row justify-between items-end">
            <div>
                <h3 className="hidden md:block text-md md:text-[27px] text-black-100 font-light mt-5">Explore Cars or Motorcycle you might like</h3>
            </div>
            <div className="flex gap-2 items-center">
                <select
                    className={`select select-bordered w-full max-w-xs bg-gray-400 border-none ${selectedPrice ? 'text-white' : 'text-gray-300'}`}
                    value={selectedPrice}
                    onChange={(e) => {
                        setSelectedPrice(e.target.value)
                        orderCarList(e.target.value)
                    }}
                >
                    <option value="" disabled>Price</option>
                    <option value={-1}>Min to Max</option>
                    <option value={1}>Max to Min</option>
                </select>
                <select
                    className={` md:block select select-bordered w-full max-w-xs bg-gray-400 border-none ${selectedBrand ? 'text-white' : 'text-gray-300'}`}
                    value={selectedBrand}
                    onChange={(e) => {
                        setSelectedBrand(e.target.value)
                        setBrand(e.target.value)
                    }}
                >
                    <option value="" disabled>Manufacture</option>
                    {brandList?.map((brand: string, index: number) => (
                        <option key={index + 1} value={brand}>{brand}</option>
                    ))}
                </select>
                {(selectedBrand || selectedPrice) && (
                    <button
                        className="btn btn-sm bg-gray-200 text-gray-800 border-none hover:bg-gray-300"
                        onClick={() => {
                            setSelectedBrand("")
                            setSelectedPrice("")
                            clearFilters?.()
                        }}
                        aria-label="Clear filters"
                    >
                        Clear
                    </button>
                )}
            </div>
        </section>
    )
}

export default CarsFilterOption