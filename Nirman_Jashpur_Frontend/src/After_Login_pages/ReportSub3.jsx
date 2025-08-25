import React, { useState, useEffect, useMemo } from 'react';
import Table from '../Components/TableR3.jsx';
const ReportSub3 = () => {
  return (
    <Table 
  addButtonLabel="स्वीकृतकर्ता एजेंसीवार रिपोर्ट"
  onAddNew= "/add-work"
  showAddButton={false}
  onView="/Work-Order-Form"
/>
  );
};

export default ReportSub3;