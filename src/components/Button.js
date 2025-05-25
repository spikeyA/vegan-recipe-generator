import React from "react";

export const Button = ({ children, onClick }) => (
 <button
    onClick={onClick}
    style={{
      padding: "0.75rem 2rem",
      background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
      color: "#fff",
      border: "none",
      borderRadius: "2rem",
      fontWeight: "bold",
      fontSize: "1.1rem",
      boxShadow: "0 2px 8px #bbf7d0",
      cursor: "pointer",
      transition: "background 0.2s, transform 0.1s",
    }}
    onMouseOver={e => (e.currentTarget.style.background = "linear-gradient(90deg, #16a34a 0%, #22c55e 100%)")}
    onMouseOut={e => (e.currentTarget.style.background = "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)")}
  >
    {children}
  </button>
);
