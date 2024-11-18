"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import useCartChecking from "@/hooks/use-check";
import CartItem from "./components/cart-item";
import CheckItem from "./components/check-item";
import Summary from "./components/summary";
import SummaryChecking from "./components/summary_check";

const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [isStartCountdownDisabled, setIsStartCountdownDisabled] = useState(true);
  const [isCheckingProductDisabled, setIsCheckingProductDisabled] = useState(true);

  const cart = useCart();
  const check = useCartChecking();

  useEffect(() => {
    setIsMounted(true);
    check.loadFromStorage(); 

    const startCountdownStatus = sessionStorage.getItem('isStartCountdownDisabled');
    const checkingProductStatus = sessionStorage.getItem('isCheckingProductDisabled');
    const timerStatus = sessionStorage.getItem('startTimer');

    if (startCountdownStatus === 'false') {
      setIsStartCountdownDisabled(false); 
    }

    if (checkingProductStatus === 'false') {
      setIsCheckingProductDisabled(false);
    }

    if (timerStatus === 'true') {
      setStartTimer(true); 
    } else {
      setStartTimer(false); 
    }
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
    setStopTimer(true);
    setStartTimer(false);
    setIsCheckingProductDisabled(true); 
    sessionStorage.setItem('isCheckingProductDisabled', 'true'); 
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="bg-white">
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
      <Container>
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">Product On Checking</h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {check?.items?.length === 0 && (
                <p className="text-neutral-500">No items added to check</p>
              )}
              <ul>
                {check?.items?.map((item) => (
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
