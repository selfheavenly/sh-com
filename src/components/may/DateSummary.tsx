import { useEffect, useState } from "react";
import type { Invitation, SubmitResponsePayload } from "../../api";
import { submitResponse } from "../../api";
import rubyHeart from "../../assets/ruby-heart.png";

interface DateSummaryProps {
  invitation: Invitation;
  selections: Record<string, string>; // stepKey → optionId
  pin: string;
  onUpdateResponse: () => void;
}

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
          <h1 className="may-script may-summary-title">All done!</h1>
          <img src={rubyHeart} alt="" className="may-summary-heart" />
          <p className="may-summary-pickup">
            I'll pick you up at{" "}
            <strong>{invitation.pickupTime}</strong>
          </p>
        </div>

        <button
          onClick={onUpdateResponse}
          className="may-action-link may-summary-action"
        >
          Update Response
        </button>
      </div>
    </div>
  );
}
