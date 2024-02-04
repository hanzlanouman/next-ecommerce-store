import React from "react";
import HorizontalMenu from "./HorizontalMenu";
import Image from "next/image";
import { formatPrice } from "@app/utils/helper";
import Link from "next/link";

interface Props {
    products: {
        id: string;
        title: string;
        thumbnail: string;
        price: number;
    }[];
}

export default function SimilarProductsList({ products }: Props) {
    return (
        <div className="py-6 w-full">
            <h1 className="font-semibold text-lg mb-4 text-blue-gray-600">
                Also you may like
            </h1>
            <HorizontalMenu>
                {products.map((product) => (
                    <Link href={`/${product.title}/${product.id}`} key={product.id}>
                        <div className="block w-[210px] space-y-6 mr-2 cursor-pointer">
                            <div className="w-full h-[200px] relative">
                                <Image
                                    layout="fill"
                                    objectFit="contain"
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="rounded"

                                />
                            </div>
                            <div className="text-center">
                                <h2 className=" line-clamp-2 h-12 text-l">{product.title}</h2>
                                <p className="font-semibold">{formatPrice(product.price)}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </HorizontalMenu>
        </div>
    );
}