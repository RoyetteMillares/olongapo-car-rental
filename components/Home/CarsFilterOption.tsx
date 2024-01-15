"use client"
import { useEffect, useState } from "react"

function CarsFilterOption({ carsFilter, setBrand, orderCarList }: any) {
    const [brandList, setBrandList] = useState<any>()

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
        <section className="mt-10 flex justify-between items-center">
            <div>
                <h2 className="hero__subtitle">Cars Catalog</h2>
                <h3>Explore Cars you might like</h3>
            </div>
            <div className="flex gap-2 items-center">
                <select className="select select-bordered w-full max-w-xs"
                    onChange={(e) => orderCarList(e.target.value)}
                >
                    <option disabled defaultValue="Price">Price</option>
                    <option value={-1}>Min to Max</option>
                    <option value={1}>Max to Min</option>
                </select>
                <select className="hidden md:block select select-bordered w-full max-w-xs"
                    onChange={(e) => setBrand(e.target.value)}
                >
                    <option defaultValue="Manufacture">Manufacture</option>
                    {brandList?.map((brand: string, index: number) => (
                        <option key={index + 1}>{brand}</option>
                    ))}

                </select>
            </div>
        </section>
    )
}

export default CarsFilterOption