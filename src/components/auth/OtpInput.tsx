import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  length?: number;
  autoFocus?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  disabled = false,
  length = 6,
  autoFocus = true,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split string into digits array
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawChar = e.target.value.slice(-1); // Take latest typed character
    if (!/^\d*$/.test(rawChar)) return; // Allow only digits

    const nextDigits = [...digits];
    nextDigits[index] = rawChar;
    const nextValue = nextDigits.join('').slice(0, length);
    onChange(nextValue);

    // Auto-advance focus to next box if digit was typed
    if (rawChar && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move to previous box if currently empty
        inputRefs.current[index - 1]?.focus();
      } else {
        const nextDigits = [...digits];
        nextDigits[index] = '';
        onChange(nextDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    const cleanNumbers = pastedData.replace(/\D/g, '').slice(0, length);
    if (!cleanNumbers) return;

    onChange(cleanNumbers);
    const targetFocusIndex = Math.min(cleanNumbers.length, length - 1);
    inputRefs.current[targetFocusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3" role="group" aria-label="6-digit verification code">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          value={digits[index]}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          aria-label={`Digit ${index + 1} of ${length}`}
          className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-hidden
            ${
              digits[index]
                ? 'border-[#6558E8] bg-[#6558E8]/5 text-[#17233C]'
                : 'border-[#E8E8F0] bg-white text-[#17233C]'
            }
            focus:border-[#6558E8] focus:ring-4 focus:ring-[#6558E8]/20
            disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400`}
        />
      ))}
    </div>
  );
};

