import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CooldownTimerProps {
  initialSeconds: number;
  onFinished?: () => void;
}

export const CooldownTimer: React.FC<CooldownTimerProps> = ({
  initialSeconds,
  onFinished,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onFinished?.();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinished?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onFinished]);

  const minutes = Math.floor(secondsLeft / 60);
  const remainingSeconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

  if (secondsLeft <= 0) return null;

  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500" aria-live="polite">
      <Clock className="w-4 h-4 text-slate-400" />
      <span>Resend available in <strong className="text-slate-700">{formattedTime}</strong></span>
    </span>
  );
};

