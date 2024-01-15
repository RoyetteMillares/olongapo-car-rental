import React from 'react'
import CarsCard from '../Home/CarsCard'
import Form from './Form'

export default function BookingModal({ car }: any) {
    console.log(car, 'idd')
    return (
        <div>
            <form method='dialog' className='modal-box w-full lg:max-w-[60rem]'>
                <div className='border-b-[1px] pb-2'>
                    <h3 className='text-[30px] font-light text-gray-800'>Rent A Car now</h3>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 p-2 md:p-5'>
                    <div>
                        <CarsCard car={car} />
                    </div>
                    <div>
                        <Form car={car} />
                    </div>
                </div>
            </form>
        </div>
    )
}
