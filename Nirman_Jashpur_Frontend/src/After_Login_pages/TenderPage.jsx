import React, { useState, useEffect, useMemo } from 'react';
import Table from '../Components/Table.jsx';
const TenderPage = () => {
  return (
    <Table 
  addButtonLabel="निविदा"
  onAddNew= "/add-work"
  showAddButton={false}
  onView="/Tender-Form"
/>
  );
};

export default TenderPage;
