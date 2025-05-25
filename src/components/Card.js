import React from "react";

export const Card = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
    <h2 className="text-xl font-semibold text-green-700 mb-4">{title}</h2>
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div className="p-6 flex flex-col items-center">
    {children}
  </div>
);
