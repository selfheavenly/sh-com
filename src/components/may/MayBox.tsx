import envelope from "../../assets/envelope.png";
import rubyHeart from "../../assets/ruby-heart.png";

interface MayBoxProps {
  onOpen: () => void;
}

export function MayBox({ onOpen }: MayBoxProps) {
  return (
    <div className="may-screen">
      <div className="may-stage">
        <div className="maybox-content">
          <h1 className="may-script maybox-title">Dear May,</h1>
          <p className="maybox-copy">A little invitation is waiting.</p>

          <button
            type="button"
            onClick={onOpen}
            className="maybox-button group active:scale-[0.98] transition-transform"
          >
            <span className="may-envelope-wrap">
              <img src={envelope} alt="" className="may-envelope" />
              <img src={rubyHeart} alt="" className="may-envelope-heart" />
            </span>
            <span className="may-action-link">Click to unseal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
