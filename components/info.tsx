"use client";
import { Product } from "@/types";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { MouseEventHandler } from "react";
import useCart from "@/hooks/use-cart";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();
  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    cart.addItem(data);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      <div className="flex items-end justify-between mt-3">
        <p className="text-2xl text-gray-900">
          <Currency value={data?.price} />
        </p>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Type of Product:</h3>
          <div>{data?.type?.name}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Creator:</h3>
          <div>{data.creator.name}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Mint Time:</h3>
          <div>{data.createdAt}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Creator:</h3>
          <div>{data.updatedAt}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Describe of Product:</h3>
          <div className="w-3/4">{data?.describe}</div>
        </div>
      </div>
      <div className="flex items-center mt-10 gap-x-4">
        <Button className="flex items-center gap-x-2"
          onClick={onAddToCart} >
          Add To Cart
          <ShoppingCart />
        </Button>
      </div>
    </div>
  );
};

export default Info;
