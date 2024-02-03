"use client";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    CardFooter,
    Chip,
} from "@material-tailwind/react";
import Image from "next/image";
import Link from "next/link";
import truncate from "truncate";
import { formatPrice } from "../utils/helper";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface Props {
    product: {
        id: string;
        title: string;
        description: string;
        category: string;
        thumbnail: string;
        sale: number;
        price: {
            base: number;
            discounted: number;
        };
    };
}

export default function ProductCard({ product }: Props) {
    const { loggedIn } = useAuth()
    const [isPending, startTransition] = useTransition();
    const router = useRouter()
    const addToCart = async () => {

        if (!loggedIn) return router.push('/auth/signin')
        const res = await fetch("/api/product/cart", {
            method: "POST",
            body: JSON.stringify({ productId: product.id, quantity: 1 }),
        });

        const { error } = await res.json();

        if (!res.ok && error) toast.error(error);
        if (res.ok) toast.success("Product added to cart");

        router.refresh();


    };

    const handleCheckout = async () => {


        const res = await fetch('/api/checkout/instant', {
            method: "POST",
            body: JSON.stringify({
                productId: product.id,
            }),
        });

        const { url, error } = await res.json();
        if (!res.ok && error) {
            toast.error(error);
        } else {
            window.location.href = url;
        }
    }

    return (
        <Card className="w-full">
            <Link className="w-full" href={`/${product.title}/${product.id}`}>
                <CardHeader
                    shadow={false}
                    floated={false}
                    className="relative w-full aspect-square m-0"
                >
                    <Image
                        className="object-contain"
                        src={product.thumbnail} alt={product.title} fill />
                    <div className="absolute right-0 p-2 ">
                        <Chip color="red" value={`${product.sale}% off`} />
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="mb-2">
                        <h3 className="line-clamp-1 font-medium text-blue-gray-800">
                            {truncate(product.title, 50)}
                        </h3>
                    </div>
                    <div className="flex justify-end items-center space-x-2 mb-2">
                        <Typography color="blue-gray" className="font-medium line-through">
                            {formatPrice(product.price.base)}
                        </Typography>
                        <Typography color="blue-gray" className="font-medium">
                            {formatPrice(product.price.discounted)}
                        </Typography>
                    </div>
                    <p className="font-normal text-sm opacity-75 line-clamp-3">
                        {product.description}
                    </p>
                </CardBody>
            </Link>
            <CardFooter className="pt-0 space-y-4">
                <Button
                    disabled={isPending}

                    onClick={() => {
                        startTransition(async () => {
                            await addToCart()
                        });
                    }}
                    ripple={false}
                    fullWidth={true}
                    className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:shadow-none hover:scale-105 focus:shadow-none focus:scale-105 active:scale-100"
                >
                    Add to Cart
                </Button>
                <Button
                    onClick={() => {
                        startTransition(async () => {
                            await handleCheckout()
                        });
                    }}
                    ripple={false}
                    fullWidth={true}
                    className="bg-blue-400 text-white shadow-none hover:shadow-none hover:scale-105 focus:shadow-none focus:scale-105 active:scale-100"
                >
                    Buy Now
                </Button>
            </CardFooter>
        </Card>
    );
}
