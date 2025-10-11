import React from "react";

export function Button({ children, onClick, variant = "default", size = "md" }) {
  return (
    <button className={`btn ${variant} ${size}`} onClick={onClick}>
      {children}
    </button>
  );
}
