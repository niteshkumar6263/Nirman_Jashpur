import React, { useState, useEffect, useMemo } from 'react';
import Table from '../Components/Table.jsx';
const TechnicalApprovalPage = () => {
  return (
    <Table 
  addButtonLabel="तकनीकी स्वीकृति"
  onAddNew= "/add-work"
  showAddButton={false}
  onView="/Technical-Approval-Form"
/>
  );
};

export default TechnicalApprovalPage;
