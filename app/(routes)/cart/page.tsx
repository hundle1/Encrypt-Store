"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import useCartChecking from "@/hooks/use-check";
import CartItem from "./components/cart-item";
import CheckItem from "./components/check-item";
import Summary from "./components/summary";
import SummaryChecking from "./components/summary_check";
import { Product } from "@/types";
import { useStateContext } from "@/components/context"; 

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);

  const cart = useCart();
  const check = useCartChecking();
  const { lockBuy, connect, address } = useStateContext(); 

  // Load check_items từ localStorage
  useEffect(() => {
    const storedCheckItems = localStorage.getItem("check_items");
    if (storedCheckItems) {
      const parsed = JSON.parse(storedCheckItems);
      check.setItems(parsed);
    }
    setIsMounted(true);
  }, []);

  const handleCheckout = () => {
    setStopTimer(false);
  };

  const handleItemRemove = (id: string) => {
    check.removeItem(id);
    cart.removeItem(id);
    setStopTimer(true);
  };

  // Hàm lockBuy gọi contract (stub)
    const handleLockBuy = async (productId: string, approve: boolean) => {
    try {
      if (!address) await connect(); // 👈 Kết nối Metamask nếu chưa kết nối
      const tx = await lockBuy(productId, approve);
      await tx.wait();
      console.log("Transaction successful:", tx);
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="bg-white">
      {/* container 1 */}
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cart?.items?.length === 0 && <p className="text-neutral-500">No items added to cart</p>}
              <ul>
                {cart?.items?.map((item) => (
                  <CartItem key={item.id} data={item} />
                ))}
              </ul>
            </div>
            <Summary onCheckout={handleCheckout} />
          </div>
        </div>
      </Container>

      {/* container 2 */}
      <Container>
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">Product On Checking</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {Array.isArray(check?.items) && check.items.length === 0 && (
                <p className="text-neutral-500">No items added to check</p>
              )}
              <ul>
                {Array.isArray(check?.items) &&
                  check.items.map((item) => (
                    <CheckItem
                      key={item.id}
                      data={item}
                      onRemove={() => handleItemRemove(item.id)}
                    />
                  ))}
              </ul>
            </div>
             <SummaryChecking
              stopTimer={stopTimer}
              startTimer={check.items.length > 0 && !stopTimer}
              productId={check.items[0]?.id}
              onLockBuy={handleLockBuy} // 👈 Gọi từ prop
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;