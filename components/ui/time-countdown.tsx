"use client";

import { useEffect, useState } from "react";

interface TimeCountdownProps {
  onTimeEnd: () => void;
  stopTimer: boolean;
  startTimer: boolean;
}

const TimeCountdown: React.FC<TimeCountdownProps> = ({ onTimeEnd, stopTimer, startTimer }) => {
  const [time, setTime] = useState<number>(0); 
  const [initialized, setInitialized] = useState<boolean>(false); 

  useEffect(() => {
    if (stopTimer) {
      setTime(0); 
      sessionStorage.setItem("timeLeft", "0");
      return;
    }

    if (startTimer && !initialized) {
      const endTime = Date.now() + 30 * 60 * 1000; 
      sessionStorage.setItem("endTime", endTime.toString());
      setTime(30 * 60); 
      setInitialized(true); 
    }

    if (startTimer && initialized) {
      const interval = setInterval(() => {
        const remainingTime = parseInt(sessionStorage.getItem("endTime") || "0") - Date.now();
        const secondsLeft = Math.max(remainingTime / 1000, 0); 
        setTime(secondsLeft);

        if (secondsLeft <= 0) {
          clearInterval(interval);
          onTimeEnd();
        } else {
          sessionStorage.setItem("timeLeft", secondsLeft.toString());
        }
      }, 1000);

      return () => clearInterval(interval); 
    }
  }, [stopTimer, onTimeEnd, startTimer, initialized]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return <span>{time <= 0 ? "Time Ended" : formatTime(time)}</span>;
};

export default TimeCountdown;
