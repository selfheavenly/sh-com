import type { OptionItem } from "../../api";

interface OptionCardProps {
  option: OptionItem;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function OptionCard({ option, selected, onSelect }: OptionCardProps) {
  return (
    <button
      onClick={() => onSelect(option.id)}
      className={`may-option ${selected ? "may-option-selected" : ""}`}
      aria-pressed={selected}
    >
      <div className="may-option-image">
        {option.imageUrl ? (
          <img src={option.imageUrl} alt={option.label} />
        ) : (
          <div className="h-full w-full bg-white/25" />
        )}
      </div>
      <span className="may-option-label">{option.label}</span>
    </button>
  );
}
