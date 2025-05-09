"use client";

import Button from "@/components/ui/button";
import { useState, useEffect } from "react";
import TimeCountdown from "@/components/ui/time-countdown";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface SummaryCheckingProps {
  stopTimer: boolean;
  startTimer: boolean;
  isStartCountdownDisabled: boolean;
  isCheckingProductDisabled: boolean;
  onStartCountdown: () => void;
}

const SummaryChecking: React.FC<SummaryCheckingProps> = ({
  stopTimer,
  startTimer,
  isStartCountdownDisabled,
  isCheckingProductDisabled,
  onStartCountdown,
}) => {
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(false);
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    // Điều chỉnh khi đếm ngược bắt đầu hoặc dừng lại
    if (startTimer) {
      setIsCheckoutDisabled(false); // Cho phép checkout khi bắt đầu
    } else {
      setIsCheckoutDisabled(true); // Vô hiệu hóa checkout khi không có đếm ngược
    }
  }, [startTimer]);

  const onCheckout = async () => {
    // Logic checkout nếu cần
  };

  return (
    <div className="px-4 py-6 mt-16 rounded-lg bg-gray-50 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">You are on Wait Time Check</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-base font-medium text-gray-400">Time counter currently</div>
          <TimeCountdown
            onTimeEnd={() => setIsCheckoutDisabled(true)}
            stopTimer={stopTimer}
            startTimer={startTimer}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <Button
          disabled={items.length === 0 || isCheckoutDisabled || isCheckingProductDisabled}
          className="w-full mt-6 bg-sky-800"
          onClick={onCheckout}
        >
          Checking Product
        </Button>

        <Button
          className="w-full mt-6 bg-red-600"
          onClick={onStartCountdown}
          disabled={startTimer || isCheckoutDisabled} // Disabled nếu đếm ngược đã bắt đầu
        >
          Start CountDown
        </Button>
      </div>
    </div>
  );
};

export default SummaryChecking;
