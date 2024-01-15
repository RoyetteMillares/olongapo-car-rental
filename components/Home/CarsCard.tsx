import { useEffect, useState } from "react"
import Image from "next/image"
import { FaGasPump } from 'react-icons/fa'
import { MdAirlineSeatReclineNormal } from "react-icons/md";
import { PiSteeringWheelBold } from "react-icons/pi";
import Button from "../custom-button";
export default function CarsCard(props: any) {
    const [car, setCar] = useState<any>()

    useEffect(() => {
        if (props.car) {
            setCar(props.car)
        }
    }, [props.car])

    return car && (
        <>
            <div className="car-card group ">
                <div className="car-card__content">
                    <h2 className="car-card__content-title">
                        {car.carBrand} {car.name}
                    </h2>
                </div>
                <p className='flex mt-6 text-[32px] leading-[38px] font-extrabold'>
                    <span className='self-start text-[14px] leading-[17px] font-semibold'>Php </span>
                    {car.price}
                    <span className='self-end text-[14px] leading-[17px] font-medium'>/day</span>
                </p>
                <div className='relative w-full h-40 my-3 object-contain'>
                    {car && car.image && <Image src={car.image.url} alt='car model' className='object-contain' sizes="500" fill={true} />}
                </div>

                <div className='relative flex w-full mt-2'>
                    <div className='flex group-hover:invisible w-full justify-between text-grey'>
                        <div className='flex flex-col justify-center items-center gap-2'>
                            <PiSteeringWheelBold />
                            <p className='text-[14px] leading-[17px]'>
                                {car.carType}
                            </p>
                        </div>
                        <div className="car-card__icon">
                            <MdAirlineSeatReclineNormal />
                            <p className="car-card__icon-text">{car.seat}</p>
                        </div>
                        <div className="car-card__icon">
                            <FaGasPump />
                            <p className="car-card__icon-text">{car.carAvg} MPG</p>
                        </div>
                    </div>
                    <div className="car-card__btn-container">
                        <Button
                            title='Rent Now'
                            containerStyles='w-full rounded-full bg-primary-blue h-12 flex justify-center items-center p-4'
                            textStyles='text-white text-[14px] font-bold'
                            rightIcon='/right-arrow.svg'
                            handleClick={() => { }}
                        />
                    </div>
                </div>

            </div>
        </>


    )
}
