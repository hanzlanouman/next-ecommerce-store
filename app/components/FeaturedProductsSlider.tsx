"use client";
import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Product from "../(home_route)/[...product]/page";

export interface FeaturedProduct {
    id: string;
    banner: string;
    title: string;
    link: string;
    linkTitle: string;
}

interface Props {
    products: FeaturedProduct[];
}

const settings: Settings = {
    dots: true,
    lazyLoad: "anticipated",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
};
export default function FeaturedProductsSlider({ products }: Props) {
    const router = useRouter();

    if (!products.length) return null;

    return (
        <div className="
            lg:h-[380px] md:h-[300px] h-[250px] 
        ">
            {
                products.length > 1 ? (
                    <Slider {...settings}>
                        {products.map(({ banner, title, link, linkTitle }, index) => {
                            return (
                                <div className="select-none relative" key={index}>
                                    <div className="w-full lg:h-[380px] md:h-[300px] h-[250px] ">
                                        <Image fill src={banner} alt={title}
                                            // lower the brightness of the image
                                            className="filter brightness-[60%]"
                                        />
                                    </div>
                                    <div className="absolute inset-0 p-5">
                                        <div className="md:w-1/2 w-full h-full flex flex-col items-start justify-center">
                                            <h1 className="lg:text-6xl 
                                            md:text-5xl text-4xl
                                            text-white font-bold text-left mb-2">
                                                {title}
                                            </h1>
                                            <Button
                                                color={index % 2 === 0 ? 'orange' : 'cyan'}
                                                onClick={() => router.push(link)}>
                                                {linkTitle}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </Slider>
                ) : (
                    <div className="select-none relative">
                        <div className="w-full h-[380px]">
                            <Image fill src={products[0].banner} alt={products[0].title} className="filter brightness-[60%]" />
                        </div>
                        <div className="absolute inset-0 p-5">
                            <div className="w-3/4 h-full flex flex-col items-start justify-center">
                                <h1 className="text-6xl text-white font-bold text-left mb-2">
                                    {products[0].title}
                                </h1>
                                <Button color='orange' onClick={() => router.push(products[0].link)}>
                                    {products[0].linkTitle}
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}


