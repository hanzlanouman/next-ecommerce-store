"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Props {
    images: string[];
}

const settings: Settings = {
    dots: false,
    lazyLoad: "anticipated",
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    className: "w-[500px]",
};

export default function ProductImageGallery(props: Props) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { images } = props;
    const slider = useRef<Slider>(null);
    const keyStr =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    const triplet = (e1: number, e2: number, e3: number) =>
        keyStr.charAt(e1 >> 2) +
        keyStr.charAt(((e1 & 3) << 4) | (e2 >> 4)) +
        keyStr.charAt(((e2 & 15) << 2) | (e3 >> 6)) +
        keyStr.charAt(e3 & 63);

    const rgbDataURL = (r: number, g: number, b: number) =>
        `data:image/gif;base64,R0lGODlhAQABAPAA${triplet(0, r, g) + triplet(b, 255, 255)
        }/yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==`;


    return (
        <div>
            <Slider
                {...settings}
                afterChange={(currentSlide) => {
                    setCurrentSlide(currentSlide);
                }}
                ref={slider}

            >
                {images.map((img, index) => {
                    return (
                        <Image
                            key={index}
                            src={img}
                            alt="testing"
                            width={550}
                            height={550}
                            className="object-contain
                            "
                            placeholder="blur"
                            blurDataURL={rgbDataURL(220, 220, 220)}
                            loading="lazy"
                        />
                    );
                })}
            </Slider>
            <div className="flex py-2 space-x-2">
                {images.map((img, index) => {
                    return (
                        <Image
                            onClick={() => slider.current?.slickGoTo(index)}
                            className={index === currentSlide ? "ring ring-blue-300 object-contain" : "object-contain"}
                            key={index}
                            src={img}
                            alt="testing"
                            width={100}
                            height={100}
                        />
                    );
                })}
            </div>
        </div>
    );
}
