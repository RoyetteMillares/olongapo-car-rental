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
import useModalStore from "@/store";
import { CarsListProps } from "@/types"

const LandingPage = () => {
    const [carsList, setCarsList] = useState<any>([]);
    const [carsFilter, setCarsFilter] = useState<any>([])
    const [allCars, setAllCars] = useState<any>([])
    const { lastBookedCarId, setLastBookedCarId } = useModalStore();

    useEffect(() => {
        let mounted = true
        const run = async () => {
            try {
                const [result, bookedIds]: any = await Promise.all([
                    getCarsList(),
                    getCurrentlyBookedCarIds(),
                ])
                if (!mounted) return
                const filtered = (result?.carLists || []).filter((c: any) => !bookedIds.includes(c.id))
                setCarsList(filtered)
                setCarsFilter(filtered)
                setAllCars(filtered)
            } catch (error) {
                if (mounted) console.error('Error fetching cars list:', error)
            }
        }
        run()
        return () => { mounted = false }
    }, [])
    // Remove a car from lists when booked without reloading
    useEffect(() => {
        if (!lastBookedCarId) return;
        setCarsList((prev: any[]) => prev.filter((c) => c.id !== lastBookedCarId))
        setCarsFilter((prev: any[]) => prev.filter((c) => c.id !== lastBookedCarId))
        setAllCars((prev: any[]) => prev.filter((c) => c.id !== lastBookedCarId))
        setLastBookedCarId(null)
    }, [lastBookedCarId, setLastBookedCarId])

    // moved fetching into the effect above to avoid state updates after unmount

    const filterCarList = (brand: string) => {
        if (!brand) {
            setCarsList(allCars)
            return
        }
        const filterList = allCars.filter((item: any) => item.carBrand === brand)
        setCarsList(filterList)
    }
    const orderCarList = (order: any) => {
        const sortedData = [...carsFilter].sort((a, b) => order == -1 ? a.price - b.price : b.price - a.price)
        setCarsList(sortedData)
    }
    const clearFilters = () => {
        setCarsList(allCars)
    }
    return (
        <div className="h-full">
            <Hero />
            {/* <SearchInput carsFilter={carsFilter} setCarsList={setCarsList} /> */}
            <CarsFilterOption carsFilter={carsFilter}
                orderCarList={(value: string) => orderCarList(value)}
                setBrand={(value: string) => filterCarList(value)}
                clearFilters={clearFilters}
            />
            <CarsList carsList={carsList} />
        </div>
    )
}

export default LandingPage;