"use client";
import { useEffect, useState } from "react";
import { useStateContext } from '@/components/context';
import Button from "@/components/ui/button";
import TimeCountdown from "@/components/ui/time-countdown";
import useCartChecking from '@/hooks/use-check';
import Image from 'next/image';
import Currency from '@/components/ui/currency';

interface SummaryCheckingProps {
  stopTimer: boolean;
  startTimer: boolean;
  productId: string;
  onLockBuy: (productId: string, approve: boolean) => void;
}

const SummaryChecking: React.FC<SummaryCheckingProps> = ({
  stopTimer,
  startTimer,
  productId,
  onLockBuy,
}) => {
  const { lockBuy } = useStateContext();
  const check = useCartChecking();
  const [modalOpen, setModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [product, setProduct] = useState<any>(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  const handleLock = async (approve: boolean) => {
    setIsProcessing(true);
    try {
      const tx = await lockBuy(productId, approve);
      await tx.wait();
      check.removeItem(productId);
      setIsLocked(true);
      onLockBuy(productId, approve);
    } catch (err) {
      console.error("LockBuy failed:", err);
    } finally {
      setIsProcessing(false);
      setModalOpen(false);
    }
  };

  const handleCheckProduct = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
      const product = await res.json();
      if (!product.hashID) {
        alert("No hashID found for this product.");
        return;
      }
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${product.hashID}`;
      window.open(ipfsUrl, '_blank');
    } catch (err) {
      console.error("Error checking product:", err);
    }
  };

  return (
    <div className="px-4 py-6 mt-16 rounded-lg bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-900">You are on Wait Time Check</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-base font-medium text-gray-600">Time counter currently</div>
          <TimeCountdown
            onTimeEnd={() => {}}
            stopTimer={stopTimer}
            startTimer={startTimer}
          />
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <Button
          disabled={isLocked}
          className="w-full bg-sky-600 hover:bg-sky-700 transition-colors duration-200"
          onClick={handleCheckProduct}
        >
          Check Product
        </Button>
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
          disabled={isLocked}
          onClick={() => setModalOpen(true)}
        >
          Finalize Purchase
        </Button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl transform transition-all duration-300 scale-100 hover:shadow-3xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Finalize Your Purchase</h3>
            
            {/* Product Information */}
            {product ? (
              <div className="flex items-center gap-6 mb-8">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={product.images?.[0]?.url || '/placeholder-image.jpg'}
                    alt={product.name || 'Product'}
                    fill
                    className="object-cover object-center transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-gray-800">{product.name}</h4>
                  <p className="text-base text-gray-500 mt-1">Created by: {product.creator?.name || 'Unknown'}</p>
                  <p className="text-base text-gray-500">Type: {product.type?.name || 'N/A'}</p>
                  <span className="text-lg font-medium text-gray-900 mt-2">
                    <Currency value={product.price} />
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-base text-gray-500 mb-8">Loading product details...</p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-4">
              <Button
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-white hover:text-green-700 hover:font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => handleLock(true)}
              >
                {isProcessing ? 'Processing...' : 'Confirm Purchase'}
              </Button>
              <Button
                disabled={isProcessing}
                className="flex-1 bg-red-600 hover:bg-white hover:text-red-700 hover:font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => handleLock(false)}
              >
                {isProcessing ? 'Processing...' : 'Return Product'}
              </Button>
            </div>
            <Button
              disabled={isProcessing}
              className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryChecking;