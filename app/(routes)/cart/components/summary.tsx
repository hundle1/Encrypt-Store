"use client";

import { useStateContext } from '@/components/context';
import Button from '@/components/ui/button';
import Currency from '@/components/ui/currency';
import useCart from '@/hooks/use-cart';
import useCartChecking from '@/hooks/use-check';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface SummaryProps {
  onCheckout: () => void;
}

const Summary: React.FC<SummaryProps> = ({ onCheckout }) => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  
  // Dùng hook useCartChecking để truy cập hàm addItem và removeAll
  const check = useCartChecking();
  const removeAllChecks = () => {
    console.warn("removeAllChecks is not implemented in useCartChecking.");
  };
  const totalPrice = items.reduce((total, item) => total + Number(item.price), 0);
  const { address, connect, preBuy } = useStateContext();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (!address) {
      await connect();
      return;
    }

    const product = items[0];
    const productId = product.id;

    try {
      const tx = await preBuy(productId);
      // Nếu tx có phương thức wait, chờ xác nhận giao dịch
      if (tx && tx.wait) {
        await tx.wait();
      }
      toast.success("Payment completed.");
      
      // Xoá sản phẩm khỏi giỏ hàng (container 1)
      removeAll(); 
      
      // Thêm sản phẩm vào danh sách đang kiểm tra (container 2)
      check.addItem({ ...product, price: Number(product.price) });
      
      // Cập nhật lại trạng thái giao diện cha
      onCheckout();
    } catch (error) {
      console.error("PreBuy error:", error);
      toast.error("Pre-buy failed.");
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
      <Button disabled={items.length === 0} className='w-full mt-6' onClick={handleCheckout}>
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
