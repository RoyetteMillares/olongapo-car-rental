"use client"
import React, { useEffect } from "react"
import { Montserrat } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { useUser } from "@clerk/nextjs"
import useScrollToBottom from "@/utils"
const font = Montserrat({
    weight: "600",
    subsets: ["latin"]
})

function Navbar() {
    // const { isSignedIn } = useAuth()
    // const { user } = useUser()
    // const handleScrollToBottom = () => {
    //     window.scrollTo({
    //         top: document.body.scrollHeight,
    //         behavior: 'smooth'
    //     });
    // };

    return (
        <nav className="flex items-center justify-between p-4 mx-auto max-w-screen-xl h-full w-full">
            <Link href="/" className="flex items-center">
                <div className="relative mr-4">
                    <Image
                        width={50}
                        height={50}
                        alt="Logo"
                        src="/logo-rent.png"
                    />
                </div>
            </Link>
            <div className="hidden md:flex align-center gap-3">
                <h2 className="hover:bg-blue-500 cursor-pointer p-2 rounded-full hover:text-white">Home</h2>
                <h2 className="hover:bg-blue-500 cursor-pointer p-2 rounded-full hover:text-white">About Us</h2>
                <h2 className="hover:bg-blue-500 cursor-pointer p-2 rounded-full hover:text-white">Contact Us</h2>
            </div>
            <div className="flex items-center gap-x-2">
                {/* <Link
                    href={isSignedIn ? "/" : "/sign-up"}
                >

                </Link> */}
                {/* {isSignedIn ? (<>
                    {user?.imageUrl && (
                        <Image
                            src={user.imageUrl}
                            width={50}
                            height={50}
                            className="rounded-full"
                            alt="Avatar"
                        />
                    )}
                </>) :
                    (
                        <>
                            
                        </>)} */}
                <button className="p-2 bg-blue-500 px-4 rounded-full hover:scale-105 transition-all text-white" onClick={useScrollToBottom}>
                    Book Now!
                </button>
            </div>
        </nav>
    )
}

export default Navbar