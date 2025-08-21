import React, { useState, useEffect, useMemo } from 'react';
import Table from '../Components/Table.jsx';
const WorkPage = () => {
  return (
    <Table 
  addButtonLabel="Add New Work"
  onAddNew= "/add-work"
  showAddButton={true}
  onView="/work"
/>
  );
};

export default WorkPage;
