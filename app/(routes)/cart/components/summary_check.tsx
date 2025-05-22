"use client";
import { useEffect, useState } from "react";
import { useStateContext } from '@/components/context';
import Button from "@/components/ui/button";
import TimeCountdown from "@/components/ui/time-countdown";
import useCartChecking from '@/hooks/use-check';

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
  const [isLocked, setIsLocked] = useState(false); // disable buttons

  const handleLock = async (approve: boolean) => {
    setIsProcessing(true);
    try {
      const tx = await lockBuy(productId, approve);
      await tx.wait();

      // Gọi hàm remove và khóa các nút
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

  return (
    <div className="px-4 py-6 mt-16 rounded-lg bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">You are on Wait Time Check</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-base font-medium text-gray-400">Time counter currently</div>
          <TimeCountdown
            onTimeEnd={() => {}}
            stopTimer={stopTimer}
            startTimer={startTimer}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          disabled={isLocked}
          className="w-full mt-6 bg-sky-800"
          onClick={async () => {
            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
              const product = await res.json();

              if (!product.hashID) {
                alert("No hashID found for this product.");
                return;
              }

              const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${product.hashID}`;

              // Tải file về
              window.open(ipfsUrl, '_blank');
            } catch (err) {
              console.error("Error checking product:", err);
            }
          }}
        >
          Checking Product
        </Button>
        <Button
          className="w-full mt-6 bg-purple-600"
          disabled={isLocked}
          onClick={() => setModalOpen(true)}
        >
          Lock Buy
        </Button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Finalize Purchase</h3>
            <div className="flex flex-col space-y-3">
              <Button
                disabled={isProcessing}
                className="w-full"
                onClick={() => handleLock(false)}
              >
                Return Product
              </Button>
              <Button
                disabled={isProcessing}
                className="w-full bg-green-600"
                onClick={() => handleLock(true)}
              >
                Buy Product
              </Button>
            </div>
            <Button
              disabled={isProcessing}
              className="mt-4 w-full bg-gray-300"
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
