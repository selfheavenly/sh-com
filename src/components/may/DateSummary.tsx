import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { Invitation, SubmitResponsePayload } from "../../api";
import { submitResponse } from "../../api";
import rubyHeart from "../../assets/ruby-heart.png";

interface DateSummaryProps {
  invitation: Invitation;
  selections: Record<string, string>; // stepKey → optionId
  pin: string;
  onUpdateResponse: () => void;
}

const HEART_SPARKS = [
  { x: -22, y: -24, delay: 0, size: 12 },
  { x: 18, y: -28, delay: 0.1, size: 10 },
  { x: -34, y: -4, delay: 0.22, size: 9 },
  { x: 36, y: -2, delay: 0.34, size: 11 },
  { x: -26, y: 20, delay: 0.46, size: 8 },
  { x: 28, y: 22, delay: 0.58, size: 9 },
  { x: 0, y: -38, delay: 0.7, size: 8 },
  { x: -8, y: 34, delay: 0.82, size: 10 },
  { x: 10, y: 34, delay: 0.94, size: 8 },
  { x: -42, y: 12, delay: 1.06, size: 7 },
  { x: 42, y: 14, delay: 1.18, size: 7 },
  { x: 2, y: 42, delay: 1.3, size: 7 },
];

export function DateSummary({
  invitation,
  selections,
  pin,
  onUpdateResponse,
}: DateSummaryProps) {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) return;

    let cancelled = false;
    async function submit() {
      const payload: SubmitResponsePayload = {
        pin,
        filmId: selections["film"],
        tableId: selections["table"],
        glassId: selections["glass"],
        activityId: selections["activity"],
      };
      try {
        await submitResponse(invitation.id, payload);
      } finally {
        if (!cancelled) {
          setSubmitted(true);
        }
      }
    }

    submit();
    return () => {
      cancelled = true;
    };
  }, [invitation.id, pin, selections, submitted]);

  return (
    <div className="may-screen">
      <div className="may-stage">
        <div className="may-summary-content">
          <h1 className="may-script may-summary-title">Thank you!</h1>
          <div className="may-summary-heart-wrap" aria-hidden="true">
            <img src={rubyHeart} alt="" className="may-summary-heart" />
            {HEART_SPARKS.map((spark, index) => (
              <img
                key={index}
                src={rubyHeart}
                alt=""
                className="may-heart-spark"
                style={{
                  "--spark-x": `${spark.x}px`,
                  "--spark-y": `${spark.y}px`,
                  "--spark-delay": `${spark.delay}s`,
                  "--spark-size": `${spark.size}px`,
                } as CSSProperties}
              />
            ))}
          </div>
          <p className="may-summary-pickup">
            I'll pick you up at{" "}
            <strong>{invitation.pickupTime}</strong>
          </p>

          <div className="may-summary-footer">
            <p className="may-summary-note">
              Close this page if you're satisfied with your choices
            </p>
            <p className="may-summary-or">OR</p>
            <button
              onClick={onUpdateResponse}
              className="may-action-link may-summary-action"
            >
              Update Response
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
