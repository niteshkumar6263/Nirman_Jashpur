import React, { useState, useEffect, useMemo } from 'react';
import Table from '../Components/Table.jsx';
const WorkOrderPage = () => {
  return (
    <Table 
  addButtonLabel="Add New Work"
  onAddNew= "/add-work"
  showAddButton={false}
  onView="/work"
/>
  );
};

export default WorkOrderPage;
