"use client"
import React, { useEffect } from "react"
import { Montserrat } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import useScrollToBottom from "@/utils"
const font = Montserrat({
    weight: "600",
    subsets: ["latin"]
})

function Navbar() {
    const { user } = useUser()
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
                <button className="p-2 bg-blue-500 px-4 rounded-full hover:scale-105 transition-all text-white" onClick={useScrollToBottom}>
                    Book Now!
                </button>
                <SignedOut>
                    <Link href="/sign-in" className="p-2 bg-gray-100 px-4 rounded-full hover:scale-105 transition-all">Sign in</Link>
                    <Link href="/sign-up" className="p-2 bg-gray-100 px-4 rounded-full hover:scale-105 transition-all">Sign up</Link>
                </SignedOut>
                <SignedIn>
                    <Link href="/bookings" className="p-2 bg-gray-100 px-4 rounded-full hover:scale-105 transition-all">My Bookings</Link>
                    {(process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e=>e.trim().toLowerCase()).includes((user?.emailAddresses?.[0]?.emailAddress || '').toLowerCase()) && (
                        <Link href="/admin/bookings" className="p-2 bg-gray-100 px-4 rounded-full hover:scale-105 transition-all">Admin</Link>
                    )}
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </nav>
    )
}

export default Navbar