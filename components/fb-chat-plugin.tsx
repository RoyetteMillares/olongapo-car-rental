"use client"

import React from 'react'

function FacebookChat() {
    const pageId = process.env.NEXT_PUBLIC_FB_PAGE_ID
    if (!pageId) return null
    const href = `https://m.me/${pageId}`
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message us on Messenger"
            className="fixed bottom-4 right-4 z-50 rounded-full bg-[#0084FF] text-white px-4 py-2 shadow-lg hover:bg-[#0077e6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0084FF]"
        >
            Message us
        </a>
    )
}

export default FacebookChat