import React, { useState, useEffect, useMemo } from 'react';
import Table from '../Components/Table.jsx';
const AdministrativeApprovalPage = () => {
  return (
    <Table 
  addButtonLabel="प्रशासकीय स्वीकृति"
  onAddNew= "/add-work"
  showAddButton={false}
  onView="/Administrative-Approval-Form"
/>
  );
};

export default AdministrativeApprovalPage;
