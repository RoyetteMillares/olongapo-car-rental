
import Image from "next/image"
export default function Hero() {
    return (
        <section className="p-4 mx-auto max-w-screen-xl h-full w-full">
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div>
                    <h1 className="hero__title">
                        Find, book, rent a car—quick and super easy!
                    </h1>
                    <p className="hero__subtitle">
                        Streamline your car rental experience with our effortless booking
                        process.
                    </p>
                    <button className="p-2 mt-5 bg-blue-500 px-4 rounded-full hover:scale-105 transition-all text-white">Explore Cars</button>
                </div>
                <div>
                    <div className="hero__image-container relative overflow-hidden">
                        <div className="hero__image">
                            <Image src="/hero.png" alt="hero" priority fill className="object-contain" sizes="500" />

                        </div>
                        <div className="hero__image-overlay" />
                    </div>
                </div>
                {/* <div className="newhero relative w-full min-h-[50vh]"></div> */}
            </div>
        </section>
    )
}