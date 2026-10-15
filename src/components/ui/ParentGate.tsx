import React, { useState } from 'react';
import { Shield, Lock, X } from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

interface ParentGateProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const ParentGate: React.FC<ParentGateProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  // Simple math challenge for adults (e.g. 8 * 7 = 56)
  const num1 = 8;
  const num2 = 7;
  const expectedAnswer = 56;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(answer.trim(), 10) === expectedAnswer) {
      setError(false);
      setAnswer('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17233C]/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="parent-gate-title"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E8E8F0] shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#64748B] hover:text-[#17233C] p-1 rounded-lg focus-visible:outline-[#6558E8]"
          aria-label="Close parent gate"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#6558E8]/10 text-[#6558E8] flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 id="parent-gate-title" className="text-xl font-bold text-[#17233C]">
              Grown-Ups Check
            </h3>
            <p className="text-xs text-[#64748B]">
              Please verify you are a parent or guardian
            </p>
          </div>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E8E8F0] rounded-2xl p-4 mb-4">
          <p className="text-sm text-[#17233C] font-medium mb-3">
            Solve this quick challenge to continue to Parent Area:
          </p>
          <div className="text-lg font-bold text-[#6558E8] text-center py-2 bg-white rounded-xl border border-[#E8E8F0] mb-3">
            {num1} × {num2} = ?
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <label htmlFor="gate-answer" className="sr-only">
              Your answer
            </label>
            <input
              id="gate-answer"
              type="number"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError(false);
              }}
              placeholder="Enter number (56)"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E8F0] text-center text-lg font-bold focus:border-[#6558E8] focus:outline-none"
              autoFocus
            />

            {error && (
              <p className="text-xs text-[#B42318] text-center font-semibold">
                That wasn’t quite right. Please try again!
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <SecondaryButton type="button" onClick={onClose} fullWidth size="sm">
                Cancel
              </SecondaryButton>
              <PrimaryButton type="submit" fullWidth size="sm" icon={<Lock className="w-4 h-4" />}>
                Enter Parent Area
              </PrimaryButton>
            </div>
          </form>
        </div>

        <p className="text-[11px] text-[#64748B] text-center leading-normal">
          * Notice: This is a client-side gate designed for prototype demonstration. Production deployments will use authenticated parent accounts.
        </p>
      </div>
    </div>
  );
};
