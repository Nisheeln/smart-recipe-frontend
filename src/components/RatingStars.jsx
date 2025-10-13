import React from "react";
import "./css/RatingStars.css";

export default function RatingStars({ value, onChange }) {
  return (
    <div
      role="radiogroup"
      aria-label="Rate this recipe"
      className="rating-stars flex items-center gap-1"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const active = value >= n;
        return (
          <button
            key={n}
            role="radio"
            aria-checked={active}
            className={`star-button ${active ? "active" : ""}`}
            onClick={() => onChange(n)}
            title={`${n} star${n > 1 ? "s" : ""}`}
          >
            {active ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}
