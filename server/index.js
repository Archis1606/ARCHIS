require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Check for required environment variables
if (!JWT_SECRET) {
  console.error('Error: JWT_SECRET must be set in environment variables');
  console.error('Please create a .env file based on .env.example or set the variable in your shell');
  process.exit(1);
}

// MOCK DATA FOR USERS (in-memory array)
let users = [];

// Seed a default admin user if not exists
function seedAdmin() {
  const adminExists = users.find(u => u.loginId === 'admin');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    users.push({
      loginId: 'admin',
      password: hashedPassword,
      role: 'admin',
      name: 'System Administrator',
      dob: new Date('1980-01-01'),
      fatherName: 'N/A',
      mobile: '0000000000'
    });
    console.log('Default admin user created (ID: admin, Password: admin123)');
  }
}
seedAdmin();

// MOCK DATA FOR DASHBOARD AND OTHER ENDPOINTS
const mockData = {
  // Dashboard statistics
  dashboardStats: {
    totalLandRecords: 128450,
    recordsAnalyzed: 94218,
    anomaliesDetected: 3842,
    casesResolved: 2716
  },

  // Anomalies by state (for bar chart)
  anomaliesByState: [
    { state: 'Punjab', count: 420 },
    { state: 'Haryana', count: 380 },
    { state: 'Uttar Pradesh', count: 520 },
    { state: 'Rajasthan', count: 410 },
    { state: 'Maharashtra', count: 480 },
    { state: 'Madhya Pradesh', count: 390 },
    { state: 'Bihar', count: 350 },
    { state: 'Gujarat', count: 440 },
    { state: 'West Bengal', count: 370 },
    { state: 'Tamil Nadu', count: 400 },
    { state: 'Karnataka', count: 430 },
    { state: 'Telangana', count: 360 }
  ],

  // Mock Land Records with ULPIN (Unique Land Parcel Identification Number)
  landRecords: [
    {
      ulpin: 'PB-LDH-2026-984124',
      parcelId: 'PARC-PB-9841',
      ownerName: 'Gurpreet Singh',
      fatherName: 'Harbhajan Singh',
      state: 'Punjab',
      district: 'Ludhiana',
      tehsil: 'Ludhiana West',
      village: 'Gill',
      khasraNo: '142//5/2',
      khatauniNo: '88/112',
      recordedArea: '4.82 Acres',
      gisSpatialArea: '4.31 Acres',
      landType: 'Agricultural (Irrigated)',
      marketValueEstimate: '₹ 1,45,00,000',
      lastMutationDate: '2024-03-15',
      anomalyStatus: 'Area Discrepancy Detected (0.51 Acres)',
      encumbranceStatus: 'Clear (No active mortgages)',
      coordinates: '30.8654° N, 75.8569° E'
    },
    {
      ulpin: 'HR-GGM-2026-441209',
      parcelId: 'PARC-HR-4412',
      ownerName: 'Rajesh Sharma',
      fatherName: 'Ved Prakash Sharma',
      state: 'Haryana',
      district: 'Gurugram',
      tehsil: 'Wazirabad',
      village: 'Badshahpur',
      khasraNo: '76//12/1',
      khatauniNo: '104/145',
      recordedArea: '1.25 Acres',
      gisSpatialArea: '1.25 Acres',
      landType: 'Commercial / Mixed Use',
      marketValueEstimate: '₹ 8,90,00,000',
      lastMutationDate: '2025-11-20',
      anomalyStatus: 'Verified - No Anomalies',
      encumbranceStatus: 'Bank Lien (SBI Industrial Finance)',
      coordinates: '28.3980° N, 77.0543° E'
    },
    {
      ulpin: 'UP-LKO-2026-118942',
      parcelId: 'PARC-UP-1189',
      ownerName: 'Amitabh Verma',
      fatherName: 'Suresh Chandra Verma',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      tehsil: 'Sarojini Nagar',
      village: 'Amausi',
      khasraNo: '318//4',
      khatauniNo: '45/89',
      recordedArea: '3.10 Acres',
      gisSpatialArea: '3.10 Acres',
      landType: 'Residential Plot',
      marketValueEstimate: '₹ 2,75,00,000',
      lastMutationDate: '2023-08-11',
      anomalyStatus: 'Verified - Clean Record',
      encumbranceStatus: 'Clear',
      coordinates: '26.7606° N, 80.8893° E'
    },
    {
      ulpin: 'RJ-JPR-2026-773410',
      parcelId: 'PARC-RJ-7734',
      ownerName: 'Vikram Singh Rathore',
      fatherName: 'Bhairon Singh Rathore',
      state: 'Rajasthan',
      district: 'Jaipur',
      tehsil: 'Sanganer',
      village: 'Muhana',
      khasraNo: '204//18/3',
      khatauniNo: '210/332',
      recordedArea: '6.40 Acres',
      gisSpatialArea: '6.00 Acres',
      landType: 'Agricultural (Dryland)',
      marketValueEstimate: '₹ 3,20,00,000',
      lastMutationDate: '2024-07-02',
      anomalyStatus: 'Boundary Inconsistency with Road Margin',
      encumbranceStatus: 'Clear',
      coordinates: '26.7915° N, 75.7312° E'
    },
    {
      ulpin: 'MH-MUM-2026-905183',
      parcelId: 'PARC-MH-9051',
      ownerName: 'Nitin Kulkarni',
      fatherName: 'Anant Kulkarni',
      state: 'Maharashtra',
      district: 'Mumbai Suburban',
      tehsil: 'Kurla',
      village: 'Chembur',
      khasraNo: 'CTS 1084/A',
      khatauniNo: '512/04',
      recordedArea: '0.45 Acres (19,602 Sq Ft)',
      gisSpatialArea: '0.45 Acres',
      landType: 'Urban Commercial',
      marketValueEstimate: '₹ 24,50,00,000',
      lastMutationDate: '2026-01-14',
      anomalyStatus: 'Verified - Complete Cadastral Sync',
      encumbranceStatus: 'Clear',
      coordinates: '19.0622° N, 72.8994° E'
    }
  ],

  // Document types for selection
  documentTypes: [
    'Record of Rights / RoR',
    'Jamabandi',
    'Khatauni',
    'Khasra Record',
    'Mutation Record',
    'Sale Deed',
    'Registry Document',
    'Conveyance Deed',
    'Lease Deed',
    'Gift Deed',
    'Partition Deed',
    'Encumbrance Certificate',
    'Property Tax Record',
    'Municipal Property Record',
    'Cadastral Map',
    'Survey Record',
    'Land Use Record',
    'Other Supporting Document'
  ],

  // Today's work cases
  todayCases: [
    {
      id: 'CASE-001',
      parcelId: 'PARC-2026-001',
      state: 'Punjab',
      district: 'Ludhiana',
      documentType: 'Jamabandi',
      priority: 'High',
      status: 'Pending',
      assignedDate: '2026-10-03',
      action: 'Review'
    },
    {
      id: 'CASE-002',
      parcelId: 'PARC-2026-002',
      state: 'Haryana',
      district: 'Gurugram',
      documentType: 'Record of Rights / RoR',
      priority: 'Medium',
      status: 'In Review',
      assignedDate: '2026-10-03',
      action: 'Review'
    },
    {
      id: 'CASE-003',
      parcelId: 'PARC-2026-003',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      documentType: 'Sale Deed',
      priority: 'Low',
      status: 'Resolved',
      assignedDate: '2026-10-02',
      action: 'View'
    },
    {
      id: 'CASE-004',
      parcelId: 'PARC-2026-004',
      state: 'Rajasthan',
      district: 'Jaipur',
      documentType: 'Mutation Record',
      priority: 'High',
      status: 'Pending',
      assignedDate: '2026-10-03',
      action: 'Review'
    },
    {
      id: 'CASE-005',
      parcelId: 'PARC-2026-005',
      state: 'Maharashtra',
      district: 'Mumbai',
      documentType: 'Encumbrance Certificate',
      priority: 'Medium',
      status: 'In Review',
      assignedDate: '2026-10-01',
      action: 'View'
    }
  ],

  // Anomalies list
  anomaliesList: [
    {
      id: 'AN-001',
      parcelId: 'PARC-2026-001',
      state: 'Punjab',
      district: 'Ludhiana',
      anomalyType: 'Area Mismatch',
      severity: 'High',
      detectedDate: '2026-10-01',
      status: 'New',
      action: 'Review'
    },
    {
      id: 'AN-002',
      parcelId: 'PARC-2026-002',
      state: 'Haryana',
      district: 'Faridabad',
      anomalyType: 'Ownership Mismatch',
      severity: 'Critical',
      detectedDate: '2026-10-02',
      status: 'Under Review',
      action: 'Review'
    },
    {
      id: 'AN-003',
      parcelId: 'PARC-2026-003',
      state: 'Uttar Pradesh',
      district: 'Kanpur',
      anomalyType: 'Boundary Mismatch',
      severity: 'Medium',
      detectedDate: '2026-10-03',
      status: 'New',
      action: 'Review'
    },
    {
      id: 'AN-004',
      parcelId: 'PARC-2026-004',
      state: 'Rajasthan',
      district: 'Jodhpur',
      anomalyType: 'Duplicate Record',
      severity: 'High',
      detectedDate: '2026-10-02',
      status: 'New',
      action: 'Review'
    },
    {
      id: 'AN-005',
      parcelId: 'PARC-2026-005',
      state: 'Maharashtra',
      district: 'Nagpur',
      anomalyType: 'Missing Record',
      severity: 'Medium',
      detectedDate: '2026-10-03',
      status: 'Under Review',
      action: 'Review'
    }
  ]
};

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Login ID and Password' });
    }

    const user = users.find(u => u.loginId === loginId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid Login ID or Password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Login ID or Password' });
    }

    const token = jwt.sign({ id: user.loginId, loginId: user.loginId }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token, message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Search Land Records by ULPIN or general query
app.get('/api/land-records/search', (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  if (!query) {
    return res.json({ success: true, data: mockData.landRecords });
  }
  const results = mockData.landRecords.filter(record =>
    record.ulpin.toLowerCase().includes(query) ||
    record.parcelId.toLowerCase().includes(query) ||
    record.ownerName.toLowerCase().includes(query) ||
    record.state.toLowerCase().includes(query) ||
    record.district.toLowerCase().includes(query)
  );
  res.json({ success: true, data: results });
});

// Get Single Land Record by ULPIN
app.get('/api/land-records/:ulpin', (req, res) => {
  const record = mockData.landRecords.find(r => r.ulpin.toLowerCase() === req.params.ulpin.toLowerCase());
  if (!record) {
    return res.status(404).json({ success: false, message: 'Land record not found for the given ULPIN' });
  }
  res.json({ success: true, data: record });
});

// Admin route to add a new user
app.post('/api/admin/add-user', async (req, res) => {
  try {
    const { name, dob, fatherName, mobile } = req.body;

    // Validate input
    if (!name || !dob || !fatherName || !mobile) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Generate loginId: first three letters of name (lowercase) + last four digits of mobile
    const namePart = name.trim().toLowerCase().substring(0, 3).padEnd(3, 'x');
    const mobilePart = mobile.trim().slice(-4).padStart(4, '0');
    let loginId = namePart + mobilePart;

    let counter = 0;
    let originalLoginId = loginId;
    let userExists = users.find(u => u.loginId === loginId);
    while (userExists) {
      counter++;
      loginId = originalLoginId + counter.toString();
      userExists = users.find(u => u.loginId === loginId);
    }

    const hashedPassword = await bcrypt.hash(mobile, 10);

    const newUser = {
      loginId,
      password: hashedPassword,
      role: 'official',
      name,
      dob: new Date(dob),
      fatherName,
      mobile
    };

    users.push(newUser);

    res.json({
      success: true,
      message: 'User created successfully',
      data: {
        loginId: newUser.loginId,
        password: mobile
      }
    });
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Admin page route - serves a simple HTML form to add users
app.get('/admin', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>ARCHIS Admin - Add User</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Ubuntu', sans-serif; background: #0a0a0a; color: white; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .container { background: #0a0a0a; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; width: 400px; }
          h2 { text-align: center; color: white; margin-bottom: 24px; }
          .form-group { margin-bottom: 20px; }
          label { display: block; margin-bottom: 8px; font-size: 14px; color: #ccc; }
          input { width: 100%; padding: 12px; background: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; font-size: 16px; }
          input:focus { outline: none; border-color: #10B981; box-shadow: 0 0 0 2px rgba(16,185,129,0.2); }
          button { width: 100%; padding: 12px; background: #10B981; color: black; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
          button:hover { background: #34D399; }
          .message { padding: 12px; margin-top: 20px; border-radius: 8px; text-align: center; }
          .success { background: #10B98120; color: #10B981; border: 1px solid #10B981; }
          .error { background: #EF444420; color: #EF4444; border: 1px solid #EF4444; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Add New User</h2>
          <form id="addUserForm">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="dob">Date of Birth</label>
              <input type="date" id="dob" name="dob" required>
            </div>
            <div class="form-group">
              <label for="fatherName">Father's Name</label>
              <input type="text" id="fatherName" name="fatherName" required>
            </div>
            <div class="form-group">
              <label for="mobile">Mobile Number</label>
              <input type="tel" id="mobile" name="mobile" placeholder="Enter 10-digit mobile number" required>
            </div>
            <button type="submit">Add User</button>
            <div id="message"></div>
          </form>
        </div>
        <script>
          document.getElementById('addUserForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = 'Adding user...';
            messageDiv.className = 'message';

            try {
              const response = await fetch('/api/admin/add-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });
              const result = await response.json();
              if (result.success) {
                messageDiv.textContent = \`User added successfully! Login ID: \${result.data.loginId}, Password: \${result.data.password}\`;
                messageDiv.className = 'message success';
                e.target.reset();
              } else {
                messageDiv.textContent = result.message || 'Error adding user';
                messageDiv.className = 'message error';
              }
            } catch (err) {
              messageDiv.textContent = 'Failed to connect to server';
              messageDiv.className = 'message error';
            }
          });
        </script>
      </body>
    </html>
  `);
});

// Dashboard Statistics
app.get('/api/dashboard/stats', (req, res) => {
  res.json({ success: true, data: mockData.dashboardStats });
});

// Anomalies by State
app.get('/api/dashboard/anomalies-by-state', (req, res) => {
  res.json({ success: true, data: mockData.anomaliesByState });
});

// Document Types
app.get('/api/document-types', (req, res) => {
  res.json({ success: true, data: mockData.documentTypes });
});

// Today's Work Cases
app.get('/api/cases/today', (req, res) => {
  res.json({ success: true, data: mockData.todayCases });
});

// Anomalies List
app.get('/api/anomalies', (req, res) => {
  res.json({ success: true, data: mockData.anomaliesList });
});

// Anomaly Detail by ID
app.get('/api/anomalies/:id', (req, res) => {
  const anomaly = mockData.anomaliesList.find(a => a.id === req.params.id);
  if (!anomaly) {
    return res.status(404).json({ success: false, message: 'Anomaly not found' });
  }
  res.json({ success: true, data: anomaly });
});

// Document Upload (mock)
app.post('/api/documents/upload', (req, res) => {
  res.json({
    success: true,
    message: 'File uploaded successfully',
    data: {
      fileId: 'FILE-' + Date.now(),
      filename: req.body.filename || 'unknown.pdf',
      size: req.body.size || 0,
      uploadTime: new Date().toISOString()
    }
  });
});

// Document Analysis (mock)
app.post('/api/documents/analyze', (req, res) => {
  setTimeout(() => {
    res.json({
      success: true,
      message: 'Prototype analysis completed',
      data: {
        analysisId: 'ANALYSIS-' + Date.now(),
        status: 'completed',
        notes: 'This is a prototype response. No actual AI analysis was performed.'
      }
    });
  }, 1500);
});

// Update Anomaly Status
app.patch('/api/anomalies/:id/status', (req, res) => {
  const { status } = req.body;
  const anomalyIndex = mockData.anomaliesList.findIndex(a => a.id === req.params.id);
  if (anomalyIndex === -1) {
    return res.status(404).json({ success: false, message: 'Anomaly not found' });
  }

  mockData.anomaliesList[anomalyIndex].status = status;

  res.json({
    success: true,
    message: 'Anomaly status updated',
    data: mockData.anomaliesList[anomalyIndex]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
