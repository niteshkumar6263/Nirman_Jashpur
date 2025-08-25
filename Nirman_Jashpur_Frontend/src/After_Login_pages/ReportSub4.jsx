import React, { useState, useEffect, useMemo } from 'react';
import Table from '../Components/TableR4.jsx';
const ReportSub4 = () => {
  return (
    <Table 
  addButtonLabel="एजेंसीवार दस्तावेज़ों की संख्या रिपोर्ट"
  onAddNew= "/add-work"
  showAddButton={false}
  onView="/Work-Order-Form"
/>
  );
};

export default ReportSub4;
