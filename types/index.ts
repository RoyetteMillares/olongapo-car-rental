import { MouseEventHandler } from "react";

export interface CustomButtonProps {
    isDisabled?: boolean;
    btnType?: "button" | "submit";
    containerStyles?: string;
    textStyles?: string;
    title: string;
    rightIcon?: string;
    handleClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface CarsListProps {
    carLists: {
        carAvg: number;
        createdAt: string;
        id: string;
        name: string;
        price: number;
        publishedAt: string;
        updatedAt: string;
        seat: number;
        carType: string;
        carBrand: string;
    }[];
}

// Booking status reflects the admin-controlled lifecycle (matches Hygraph enum values)
export type BookingStatus = 'pending' | 'approved' | 'cancelled'

export const BOOKING_STATUSES: BookingStatus[] = ['pending', 'approved', 'cancelled']

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
    pending: 'Pending',
    approved: 'Approved',
    cancelled: 'Cancelled',
}