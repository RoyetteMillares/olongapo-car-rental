import React, { useState } from 'react'

export default function SearchInput({ carsFilter, setCarsList }: any) {
    const [searchInput, setSearchInput] = useState('');

    const handleSearch = (event: any) => {
        const inputValue = event.target.value.toLowerCase();
        const filteredList = carsFilter.filter((item: any) =>
            item.carBrand.toLowerCase().includes(inputValue)
        );
        // console.log(filteredList, 'yet')
        setCarsList(filteredList);
        setSearchInput(inputValue);
    };
    return (
        <>
            <h2 className='text-center text-[20px] hero__subtitle'>Let's search what you need</h2>
            <div className='flex justify-center items-center mt-2'>
                <div className='block md:flex gap-2 px-4 p-1 rounded-full bg-gray-100 justify-between items-center divide-x'>
                    <div className='flex items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-black">
                            <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                        </svg>
                        <input
                            type="text"
                            placeholder='Search a Car Brand'
                            className='p-2 outline-none bg-transparent'
                            value={searchInput}
                            onChange={handleSearch}
                        />

                    </div>
                    {/* <div>
                        <input type='date'
                            className='p-2 outline-none bg-transparent text-gray'
                        />
                    </div> */}
                </div>
            </div>
        </>


    )
}
