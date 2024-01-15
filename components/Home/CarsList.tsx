import React, { useRef, useState } from 'react';
import { CarsListProps } from "@/types"
import CarsCard from "./CarsCard"
import BookingModal from '../CarBooking/BookingModal';



export default function CarsList(props: any) {
    const [selectedCar, setSelectedCar] = useState<any>([])
    const myDialogRef = useRef<HTMLDialogElement>(null);
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5">
                {props.carsList.map((car: any, index: number) => (
                    <div key={index} onClick={() => { myDialogRef.current?.showModal(); setSelectedCar(car) }}>
                        <CarsCard car={car} />
                    </div>

                ))}
            </div>
            {/**RENT MODAL */}
            <dialog id="my_modal_4" className="modal" ref={myDialogRef}>
                <BookingModal car={selectedCar} />
            </dialog>
        </>
    )
}
