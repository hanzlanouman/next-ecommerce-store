"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@material-tailwind/react";
import CartCountUpdater from "@components/CartCountUpdater";
import { useParams, useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";

export default function BuyingOptions() {
    const [quantity, setQuantity] = useState(1);
    const [isPending, startTransition] = useTransition();
    const { loggedIn } = useAuth()
    const { product } = useParams()
    const router = useRouter()
    const productId = product[1]


    const handleIncrement = () => {
        setQuantity((prevCount) => prevCount + 1);
    };

    const handleDecrement = () => {
        if (quantity === 0) return;
        setQuantity((prevCount) => prevCount - 1);
    };

    const addToCart = async () => {
        if (!productId) return
        if (!loggedIn) return router.push('/auth/signin')
        const res = await fetch("/api/product/cart", {
            method: "POST",
            body: JSON.stringify({ productId, quantity }),
        });

        const { error } = await res.json();

        if (!res.ok && error) toast.error(error);
        if (res.ok) toast.success("Product added to cart");


    };

    return (
        <div className="flex items-center space-x-2">
            <CartCountUpdater
                onDecrement={handleDecrement}
                onIncrement={handleIncrement}
                value={quantity}
            />

            <Button variant="text"
                disabled={isPending}
                onClick={() => {
                    startTransition(async () => {
                        await addToCart()
                    });
                }}
            >Add to Cart</Button>
            <Button color="amber" className="rounded-full">
                Buy Now
            </Button>
        </div>
    );
}
