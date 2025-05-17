"use client";

import { useStateContext } from '@/components/context';
import Button from '@/components/ui/button';
import Currency from '@/components/ui/currency';
import useCart from '@/hooks/use-cart';
import useCartChecking from '@/hooks/use-check';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface SummaryProps {
  onCheckout: () => void;
}

const Summary: React.FC<SummaryProps> = ({ onCheckout }) => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  const check = useCartChecking();
  const removeAllChecks = () => {
    console.warn("removeAllChecks is not implemented in useCartChecking.");
  };

  const totalPrice = items.reduce((total, item) => total + Number(item.price), 0);
  const { address, connect, preBuy } = useStateContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsLoading(true);

    if (!address) {
      await connect();
      setIsLoading(false);
      return;
    }

    const product = items[0];
    const productId = product?.id;
    if (!productId) {
      toast.error("Invalid product ID");
      setIsLoading(false);
      return;
    }

    try {
      const tx = await preBuy(productId);
      if (tx && tx.wait) await tx.wait();

      toast.success("Payment completed.");
      check.addItem({ ...product, price: Number(product.price) });
      removeAll();
      onCheckout();
    } catch (error) {
      console.error("PreBuy error:", error);
      toast.error("Pre-buy failed.");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success("Payment completed via redirect.");
      removeAll();
      removeAllChecks();
    }
    if (searchParams.get('canceled')) {
      toast.error("Something went wrong.");
    }
  }, [searchParams, removeAll, removeAllChecks]);

  return (
    <div className='px-4 py-6 mt-16 rounded-lg bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
      <h2 className='text-lg font-medium text-gray-900'>Order Summary</h2>
      <div className='mt-6 space-y-4'>
        <div className='flex items-center justify-between pt-4 border-t border-gray-200'>
          <div className='text-base font-medium text-gray-400'>Order Total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button
        disabled={items.length === 0 || isLoading}
        className={`w-full mt-6 relative transition-all duration-300 ${isLoading
            ? 'bg-white border border-black text-black'
            : 'bg-black text-white hover:opacity-80'
          }`}
        onClick={handleCheckout}
      >
        {isLoading ? (
          <span className="flex justify-center items-center gap-1">
            <span className="dot dot1">o</span>
            <span className="dot dot2">o</span>
            <span className="dot dot3">o</span>
          </span>
        ) : (
          'Checkout'
        )}
      </Button>
      <style jsx>{`
      .dot {
        font-weight: bold;
        color: black;
        animation: bounce 0.6s infinite;
      }
      .dot1 { animation-delay: 0s; }
      .dot2 { animation-delay: 0.1s; }
      .dot3 { animation-delay: 0.2s; }

      @keyframes bounce {
        0%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-6px);
        }
      }
    `}</style>

    </div>
  );
};

export default Summary;
