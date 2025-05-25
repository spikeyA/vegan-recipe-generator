import React from "react";

export const Button = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
  >
    {children}
  </button>
);
