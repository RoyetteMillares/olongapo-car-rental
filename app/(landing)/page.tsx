"use client"
import Link from "next/link"
import {
    UserButton
} from "@clerk/nextjs";

import Hero from "@/components/Home/hero";
import SearchInput from "@/components/Home/search-input";
import CarsFilterOption from "@/components/Home/CarsFilterOption";
import { getCarsList, getCurrentlyBookedCarIds } from "@/services";
import { useEffect, useState } from "react";
import CarsList from "@/components/Home/CarsList";
import { CarsListProps } from "@/types"

const LandingPage = () => {
    const [carsList, setCarsList] = useState<any>([]);
    const [carsFilter, setCarsFilter] = useState<any>([])

    useEffect(() => {
        getCarsLists()
    }, [])

    const getCarsLists = async () => {
        try {
            const [result, bookedIds]: any = await Promise.all([
                getCarsList(),
                getCurrentlyBookedCarIds(),
            ]);
            const filtered = (result?.carLists || []).filter((c: any) => !bookedIds.includes(c.id))
            setCarsList(filtered)
            setCarsFilter(filtered)
        } catch (error) {
            console.error('Error fetching cars list:', error);
        }
    };

    const filterCarList = (brand: string) => {
        const filterList = carsFilter.filter((item: any) => item.carBrand === brand)
        setCarsList(filterList)
    }
    const orderCarList = (order: any) => {
        const sortedData = [...carsFilter].sort((a, b) => order == -1 ? a.price - b.price : b.price - a.price)
        setCarsList(sortedData)
    }
    return (
        <div className="h-full">
            <Hero />
            {/* <SearchInput carsFilter={carsFilter} setCarsList={setCarsList} /> */}
            <CarsFilterOption carsFilter={carsFilter}
                orderCarList={(value: string) => orderCarList(value)}
                setBrand={(value: string) => filterCarList(value)}
            />
            <CarsList carsList={carsList} />
        </div>
    )
}

export default LandingPage;