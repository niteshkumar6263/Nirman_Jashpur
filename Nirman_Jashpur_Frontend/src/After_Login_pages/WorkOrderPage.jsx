import React, { useState, useEffect, useMemo } from 'react';
import Table from '../Components/Table.jsx';
const WorkOrderPage = () => {
  return (
    <Table 
  addButtonLabel="कार्य आदेश"
  onAddNew= "/add-work"
  showAddButton={false}
  onView="/Work-Order-Form"
/>
  );
};

export default WorkOrderPage;
