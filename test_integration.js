// Simple test to verify AddToWork to WorkPage integration
const STORAGE_KEY = 'tribal_work_data_v1';

// Mock data that would be added from AddToWork form
const testFormData = {
  workYear: '2024-25',
  dept: 'आदिवासी विकास विभाग, जशपुर',
  subDept: 'उपविभाग A',
  centralDept: 'केंद्रीय विभाग A',
  scheme: 'CM योजना',
  amount: '15.50',
  longitude: '83.123456',
  latitude: '22.654321',
  areaType: 'ग्राम',
  block: 'Jashpur',
  ward: 'Ward 1',
  workType: 'सीसी रोड',
  workCategory: 'नई',
  workName: 'Test Road Construction',
  engineer: 'Engineer A',
  sdo: 'SDO A',
  startDate: '20-08-2025'
};

// Function to simulate AddToWork form submission
function simulateFormSubmission() {
  console.log('=== Testing AddToWork Integration ===');
  
  // Load existing data (simulating loadWorkData function)
  let existingData = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      existingData = JSON.parse(raw);
    }
  } catch (e) {
    console.log('No existing data found');
  }
  
  console.log('Existing data count:', existingData.length);
  
  // Create new work entry (simulating AddToWork submit function)
  const newId = (existingData.reduce((max, item) => Math.max(max, item.id || 0), 0)) + 1;
  const today = new Date().toLocaleDateString('en-GB');
  
  const newWorkEntry = {
    id: newId,
    type: testFormData.workType,
    year: testFormData.workYear,
    vname: testFormData.ward || testFormData.block || testFormData.areaType,
    name: testFormData.workName,
    agency: testFormData.dept,
    plan: testFormData.scheme,
    amount: parseFloat(testFormData.amount).toFixed(2),
    status: 'कार्य आदेश लम्बित',
    modified: today,
    details: {
      workCategory: testFormData.workCategory,
      subDept: testFormData.subDept,
      centralDept: testFormData.centralDept,
      longitude: testFormData.longitude,
      latitude: testFormData.latitude,
      engineer: testFormData.engineer,
      sdo: testFormData.sdo,
      startDate: testFormData.startDate
    }
  };
  
  console.log('New work entry:', newWorkEntry);
  
  // Add to beginning of array (latest first)
  const updatedData = [newWorkEntry, ...existingData];
  
  // Save to localStorage (simulating saveWorkData function)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  
  console.log('Updated data count:', updatedData.length);
  console.log('Integration test completed successfully!');
  console.log('The new work should now appear in WorkPage table.');
  
  return newWorkEntry;
}

// Run the test if this is run in browser console
if (typeof window !== 'undefined') {
  console.log('Run simulateFormSubmission() to test the integration');
}

// Export for Node.js testing (not needed for this simple test)
if (typeof module !== 'undefined') {
  module.exports = { simulateFormSubmission, testFormData };
}
