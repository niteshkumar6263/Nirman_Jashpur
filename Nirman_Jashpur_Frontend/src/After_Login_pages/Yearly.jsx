// src/Pages/Yearly.jsx
import React from "react";
import YearlyTable from "../Components/YearlyTable";

const yearlyData = [
  {
    id: 1,
    year: "2024-25",
    total: 49,
    start: 0,
    tender: 0,
    orderPending: 48,
    orderIssued: 0,
    progress: 1,
    completed: 0,
    cancelled: 0,
    closed: 0,
  },
  {
    id: 2,
    year: "2022-23",
    total: 2,
    start: 0,
    tender: 0,
    orderPending: 2,
    orderIssued: 0,
    progress: 0,
    completed: 0,
    cancelled: 0,
    closed: 0,
  },
];

const Yearly = () => {
  return (
    <div className="p-6">
      <YearlyTable title="वित्तीय वर्ष सूची" rows={yearlyData} />
    </div>
  );
};

export default Yearly;
