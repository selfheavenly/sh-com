import { useState, useEffect, useRef } from "react";
import { verifyPin } from "../../api";

interface MayLockProps {
  invitationId: string;
  onUnlocked: (pin: string) => void;
}

export function MayLock({ invitationId, onUnlocked }: MayLockProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const checkingRef = useRef(false);
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [focused, setFocused] = useState(false);

  const activeIndex = Math.min(digits.findIndex((digit) => !digit), 3);
  const highlightedIndex = activeIndex === -1 ? 3 : activeIndex;

  // Auto-submit when all 4 digits are entered
  useEffect(() => {
    const pin = digits.join("");
    if (pin.length !== 4 || checkingRef.current) return;

    let cancelled = false;
    checkingRef.current = true;
    verifyPin(invitationId, pin)
      .then(({ valid }) => {
        if (cancelled) return;
        if (valid) {
          onUnlocked(pin);
          return;
        }
        rejectPin();
      })
      .catch(() => {
        if (!cancelled) rejectPin();
      })
      .finally(() => {
        if (!cancelled) checkingRef.current = false;
      });

    return () => {
      cancelled = true;
      checkingRef.current = false;
    };
  }, [digits, invitationId, onUnlocked]);

  function rejectPin() {
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setDigits(["", "", "", ""]);
      setError(true);
      setTimeout(() => setError(false), 2000);
    }, 500);
  }

  return (
    <div className="may-screen">
      <div
        onClick={() => inputRef.current?.focus()}
        className="may-stage select-none"
      >
        <div className="may-lock-content">
          <h1 className="may-lock-title">Maylock</h1>
          <p className="may-lock-subtitle">Only May may enter.</p>

          <input
            ref={inputRef}
            value={digits.join("")}
            onChange={(event) => {
              const next = event.target.value.replace(/\D/g, "").slice(0, 4);
              setDigits([
                next[0] ?? "",
                next[1] ?? "",
                next[2] ?? "",
                next[3] ?? "",
              ]);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="may-hidden-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            autoFocus
            aria-label="Invitation PIN"
          />

          <div
            className={`may-pin-grid transition-transform ${
              focused ? "may-pin-grid-active" : ""
            } ${
              shaking ? "animate-[shake_0.4s_ease]" : ""
            }`}
          >
            {digits.map((digit, index) => (
              <button
                key={index}
                type="button"
                onClick={() => inputRef.current?.focus()}
                className={`may-pin-box ${
                  focused && index === highlightedIndex ? "may-pin-box-active" : ""
                }`}
                aria-label={`PIN digit ${index + 1}`}
              >
                {digit ? "*" : ""}
              </button>
            ))}
          </div>

          {error && (
            <p className="mt-6 text-xs tracking-[0.28em] uppercase text-[#971d25] animate-fade-in">
              Wrong PIN
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
