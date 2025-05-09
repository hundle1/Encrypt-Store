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

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [isStartCountdownDisabled, setIsStartCountdownDisabled] = useState(true);
  const [isCheckingProductDisabled, setIsCheckingProductDisabled] = useState(true);

  const cart = useCart();
  const check = useCartChecking(); // ✅ phải khai báo trước khi dùng trong useEffect

  // Load check_items từ localStorage và đồng bộ với zustand
  useEffect(() => {
    const storedCheckItems = localStorage.getItem("check_items");
    if (storedCheckItems) {
      const parsed = JSON.parse(storedCheckItems);
      check.setItems(parsed);
    }
    // không nên để [check] ở dependency array
  }, []);


  useEffect(() => {
    setIsMounted(true);
    const startCountdownStatus = sessionStorage.getItem('isStartCountdownDisabled');
    const checkingProductStatus = sessionStorage.getItem('isCheckingProductDisabled');
    const timerStatus = sessionStorage.getItem('startTimer');

    setIsStartCountdownDisabled(startCountdownStatus === 'false' ? false : true);
    setIsCheckingProductDisabled(checkingProductStatus === 'false' ? false : true);
    setStartTimer(timerStatus === 'true');
  }, []);

  const handleCheckout = () => {
    setStartTimer(false);
    setIsStartCountdownDisabled(false);
    sessionStorage.setItem('isStartCountdownDisabled', 'false');
  };

  const handleStartCountdown = () => {
    setStopTimer(false);
    setStartTimer(true);
    setIsStartCountdownDisabled(true);
    setIsCheckingProductDisabled(false);
    sessionStorage.setItem('isStartCountdownDisabled', 'true');
    sessionStorage.setItem('isCheckingProductDisabled', 'false');
  };

  const handleItemRemove = (id: string) => {
    check.removeItem(id);
    cart.removeItem(id);
    setStopTimer(true);
    setStartTimer(false);
    setIsCheckingProductDisabled(true);
    sessionStorage.setItem('isCheckingProductDisabled', 'true');
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
                    <CheckItem key={item.id} data={item} onRemove={() => handleItemRemove(item.id)} />
                  ))}
              </ul>
            </div>
            <SummaryChecking
              stopTimer={stopTimer}
              startTimer={startTimer}
              isStartCountdownDisabled={isStartCountdownDisabled}
              isCheckingProductDisabled={isCheckingProductDisabled}
              onStartCountdown={handleStartCountdown}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
