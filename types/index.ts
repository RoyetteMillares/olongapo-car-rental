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