"use client";
import { useEffect, useState } from "react";

interface Props {
  onTimeEnd: () => void;
  stopTimer: boolean;
  startTimer: boolean;
}

const COUNTDOWN_SECONDS = 30 * 60; // 30 phút

const TimeCountdown = ({ onTimeEnd, stopTimer, startTimer }: Props) => {
  const getInitialRemaining = () => {
    const storedStart = localStorage.getItem("countdownStart");
    if (storedStart) {
      const elapsed = Math.floor((Date.now() - parseInt(storedStart)) / 1000);
      const timeLeft = COUNTDOWN_SECONDS - elapsed;
      return timeLeft > 0 ? timeLeft : 0;
    }
    return COUNTDOWN_SECONDS;
  };

  const [remaining, setRemaining] = useState<number>(getInitialRemaining);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(startTimer);

  useEffect(() => {
    if (stopTimer) {
      localStorage.removeItem("countdownStart");
      setRemaining(COUNTDOWN_SECONDS);
      setIsTimerRunning(false);
      return;
    }

    let interval: NodeJS.Timeout | null = null;
    let startTime: number;

    const storedStart = localStorage.getItem("countdownStart");

    if (startTimer && !storedStart) {
      startTime = Date.now();
      localStorage.setItem("countdownStart", startTime.toString());
      setIsTimerRunning(true); // Bắt đầu chạy đồng hồ
    } else if (storedStart) {
      startTime = parseInt(storedStart);
    } else {
      return;
    }

    interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const timeLeft = COUNTDOWN_SECONDS - elapsed;

      if (timeLeft <= 0) {
        clearInterval(interval!);
        localStorage.removeItem("countdownStart");
        setRemaining(0);
        onTimeEnd();
      } else {
        setRemaining(timeLeft);
      }
    }, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTimer, stopTimer]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <span className="font-semibold text-black">
      {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
    </span>
  );
};

export default TimeCountdown;
