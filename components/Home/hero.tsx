
import Image from "next/image"
import DynamicTitle from "../DynamicTitle"
import useScrollToBottom from "@/utils"
export default function Hero() {
    return (
        <section className="p-4 mx-auto max-w-screen-xl h-full w-full mb-[5rem] xl:mt-[2.5rem]">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-5">
                <div>
                    <h1 className="hero__title">
                        Find, book, rent a car—quick and
                        <DynamicTitle
                            title="super easy!"
                            image="/circle-yellow.svg"
                            width="md:w-[390px]"
                            height="hidden md:block"
                        />
                    </h1>
                    <p className="hero__subtitle">
                        Streamline your car rental experience with our effortless booking
                        process.
                    </p>
                    <button className="p-4 mt-5 text-blue-500 border-2 border-blue-500 cursor-pointer md:bg-blue-500 px-4 rounded-full hover:scale-105 transition-all md:text-white" onClick={useScrollToBottom}>Explore Cars</button>
                </div>
                <div>
                    <div className="hero__image-container relative overflow-hidden">
                        <div className="hero__image">
                            <Image src="/hero.png" alt="hero" priority fill className="object-contain" sizes="500" />
                        </div>
                        {/* <div className="hero__image-overlay" /> */}
                    </div>
                </div>
                {/* <div className="newhero relative w-full min-h-[50vh]"></div> */}
            </div>
        </section>
    )
}