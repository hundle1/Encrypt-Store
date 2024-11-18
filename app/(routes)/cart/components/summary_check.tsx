"use client";

import Button from "@/components/ui/button";
import useCartChecking from "@/hooks/use-check";
import { useState, useEffect } from "react";
import TimeCountdown from "@/components/ui/time-countdown";

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
  const items = useCartChecking((state) => state.items);

  useEffect(() => {
    if (startTimer) {
      setIsCheckoutDisabled(false);
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
          <TimeCountdown onTimeEnd={() => setIsCheckoutDisabled(true)} stopTimer={stopTimer} startTimer={startTimer} />
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
          disabled={isStartCountdownDisabled}
        >
          Start CountDown
        </Button>
      </div>
    </div>
  );
};

export default SummaryChecking;
