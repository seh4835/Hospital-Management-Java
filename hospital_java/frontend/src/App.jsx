import React, { useState, useEffect } from 'react';
import './index.css';
import * as api from './api';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [beds, setBeds] = useState([]);
  const [otRooms, setOtRooms] = useState([]);
  const [records, setRecords] = useState([]);
  const [bills, setBills] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [tests, setTests] = useState([]);
  const [operations, setOperations] = useState([]);

  const loadData = async () => {
    try {
      const p = await api.fetchPatients();
      const d = await api.fetchDoctors();
      const a = await api.fetchAppointments();
      const bedsData = await api.fetchBeds();
      const otData = await api.fetchOTRooms();
      const recs = await api.fetchRecords();
      const b = await api.fetchBills();
      const m = await api.fetchMedicines();
      const t = await api.fetchTests();
      const op = await api.fetchOperations();

      setPatients(p || []);
      setDoctors(d || []);
      setAppointments(a || []);
      setBeds(bedsData || []);
      setOtRooms(otData || []);
      setRecords(recs || []);
      setBills(b || []);
      setMedicines(m || []);
      setTests(t || []);
      setOperations(op || []);
    } catch (e) {
      console.error('Error fetching data (is the Java API server running?)', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Sanctuary Health</h2>
        </div>
        <nav className="sidebar-nav">
          {[
            { key: 'Dashboard', label: 'Dashboard' },
            { key: 'Patients', label: 'Patients' },
            { key: 'Doctors', label: 'Doctors' },
            { key: 'Appointments', label: 'Schedule' },
            { key: 'Beds', label: 'Hospital Beds' },
            { key: 'OTRooms', label: 'OT Rooms' },
            { key: 'Records', label: 'Medical Records' },
            { key: 'Billing', label: 'Billing' },
            { key: 'Pharmacy', label: 'Pharmacy' },
            { key: 'Lab', label: 'Lab Tests' },
            { key: 'Operations', label: 'Operations' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`nav-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="icon-dot"></span>
                {tab.label}
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'Dashboard' && (
          <Dashboard
            patients={patients}
            doctors={doctors}
            appointments={appointments}
            beds={beds}
            records={records}
            bills={bills}
            medicines={medicines}
            tests={tests}
            operations={operations}
            reload={loadData}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'Patients' && <PatientsView patients={patients} reload={loadData} />}
        {activeTab === 'Doctors' && <DoctorsView doctors={doctors} reload={loadData} />}
        {activeTab === 'Appointments' && <AppointmentsView appointments={appointments} patients={patients} doctors={doctors} reload={loadData} />}
        {activeTab === 'Beds' && <BedsView beds={beds} reload={loadData} />}
        {activeTab === 'OTRooms' && <OTRoomsView otRooms={otRooms} reload={loadData} />}
        {activeTab === 'Records' && <MedicalRecordsView records={records} reload={loadData} patients={patients} doctors={doctors} />}
        {activeTab === 'Billing' && <BillingView bills={bills} reload={loadData} />}
        {activeTab === 'Pharmacy' && <PharmacyView medicines={medicines} reload={loadData} />}
        {activeTab === 'Lab' && <LabView tests={tests} reload={loadData} />}
        {activeTab === 'Operations' && <OperationsView operations={operations} patients={patients} doctors={doctors} otRooms={otRooms} reload={loadData} />}
      </main>
    </div>
  );
}

// ==================== DASHBOARD ====================
function Dashboard({ patients, doctors, appointments, beds = [], records = [], bills = [], medicines = [], tests = [], operations = [], reload, setActiveTab }) {
  const availableBeds = beds.filter(r => !r.occupied).length;
  const totalRevenue = bills.reduce((acc, b) => acc + (parseFloat(b.amount) || 0), 0);
  const lowStock = medicines.filter(m => m.stock <= 10).length;

  const handleAdmit = async () => {
    const patientName = window.prompt("Enter Patient Name to Admit:");
    if (!patientName) return;
    const res = await api.admitPatient(patientName);
    if (res && res.status === 'error') {
      alert(res.message);
    } else {
      alert(`Patient ${patientName} successfully admitted!`);
      reload();
    }
  };

  const handleDischarge = async () => {
    const patientName = window.prompt("Enter Patient Name to Discharge:");
    if (!patientName) return;
    const res = await api.dischargePatient(patientName);
    if (res && res.status === 'error') {
      alert(res.message);
    } else {
      alert(`Patient ${patientName} successfully discharged!`);
      reload();
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Clinical Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card" onClick={() => setActiveTab('Patients')} style={{ cursor: 'pointer' }}>
          <h3>Patients</h3>
          <p className="stat-number">{patients.length}</p>
        </div>
        <div className="stat-card" onClick={() => setActiveTab('Doctors')} style={{ cursor: 'pointer' }}>
          <h3>Doctors</h3>
          <p className="stat-number">{doctors.length}</p>
        </div>
        <div className="stat-card" onClick={() => setActiveTab('Billing')} style={{ cursor: 'pointer' }}>
          <h3>Pending Billing</h3>
          <p className="stat-number">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="stat-card" onClick={() => setActiveTab('Beds')} style={{ cursor: 'pointer' }}>
          <h3>Beds Available</h3>
          <p className="stat-number">{availableBeds}</p>
        </div>
        <div className="stat-card" onClick={() => setActiveTab('Lab')} style={{ cursor: 'pointer' }}>
          <h3>Lab Tests</h3>
          <p className="stat-number">{tests.length}</p>
        </div>
        <div className="stat-card" onClick={() => setActiveTab('Pharmacy')} style={{ cursor: 'pointer' }}>
          <h3>Pharmacy Stock</h3>
          <p className="stat-number" style={{ color: lowStock > 0 ? '#E11D48' : '#0D9488' }}>
            {lowStock > 0 ? `${lowStock} Low` : 'Healthy'}
          </p>
        </div>
        <div className="stat-card" onClick={() => setActiveTab('Operations')} style={{ cursor: 'pointer' }}>
          <h3>Scheduled Ops</h3>
          <p className="stat-number">{operations.length}</p>
        </div>
        <div className="stat-card" onClick={() => setActiveTab('Appointments')} style={{ cursor: 'pointer' }}>
          <h3>Appointments</h3>
          <p className="stat-number">{appointments.length}</p>
        </div>
      </div>


      <div className="dashboard-actions">
        <button className="btn btn-primary" onClick={handleAdmit}>Admit Patient</button>
        <button className="btn btn-danger" onClick={handleDischarge}>Discharge Patient</button>
      </div>

      <div className="recent-section">
        <h2>Recent Hospital Activity</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Module</th>
                <th>Activity Details</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 2).map((a, i) => (
                <tr key={`a-${i}`}>
                  <td><span className="status-badge status-info">Appointment</span></td>
                  <td>{a.patientName} scheduled with Dr. {a.doctorName}</td>
                  <td>{a.date}</td>
                </tr>
              ))}
              {operations.slice(0, 2).map((op, i) => (
                <tr key={`op-${i}`}>
                  <td><span className="status-badge status-warning">Surgery</span></td>
                  <td>{op.patientName} OT Room {op.roomId}</td>
                  <td>{op.date}</td>
                </tr>
              ))}
              {tests.slice(0, 2).map((t, i) => (
                <tr key={`t-${i}`}>
                  <td><span className="status-badge status-available">Lab Test</span></td>
                  <td>{t.patientName}: {t.testType}</td>
                  <td>{t.result}</td>
                </tr>
              ))}
              {appointments.length === 0 && tests.length === 0 && operations.length === 0 && (
                <tr><td colSpan="3" style={{ textAlign: 'center', color: '#64748B', padding: '20px' }}>No recent hospital activity detected.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ==================== PATIENTS VIEW ====================
function PatientsView({ patients, reload }) {
  const [form, setForm] = useState({ patientId: '', name: '', age: '', disease: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createPatient(form);
    if (res && res.status === 'error') {
      alert(res.message);
    } else {
      setForm({ patientId: '', name: '', age: '', disease: '' });
      reload();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      await api.deletePatient(id);
      reload();
    }
  };

  const handleUpdate = async (id) => {
    const newDisease = window.prompt("Enter the updated disease for this patient:");
    if (newDisease && newDisease.trim() !== '') {
      await api.updatePatient(id, newDisease);
      reload();
    }
  };

  const filtered = patients.filter(p => {
    if (!searchQuery) return true;
    if (searchType === 'id') return p.patientId.toString().includes(searchQuery);
    if (searchType === 'name') return p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  });

  return (
    <div className="page-container">
      <h1 className="page-title">Patient Records</h1>

      <div className="form-card">
        <form onSubmit={submit} className="data-form">
          <div className="input-group">
            <label>ID</label>
            <input required type="number" placeholder="ID" value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Name</label>
            <input required type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Age</label>
            <input required type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Disease</label>
            <input required type="text" placeholder="Primary Diagnosis" value={form.disease} onChange={(e) => setForm({ ...form, disease: e.target.value })} />
          </div>
          <button type="submit" className="primary-btn">Add Patient</button>
        </form>
      </div>

      <div className="table-container">
        <div style={{ padding: '15px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '10px' }}>
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={{ padding: '8px', borderRadius: '6px' }}>
            <option value="name">Search by Name</option>
            <option value="id">Search by ID</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', width: '250px' }}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Disease</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={i}>
                <td>{p.patientId}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.disease}</td>
                <td>
                  <button className="action-btn update-btn" onClick={() => handleUpdate(p.patientId)}>Update</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(p.patientId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== DOCTORS VIEW ====================
function DoctorsView({ doctors, reload }) {
  const [form, setForm] = useState({ doctorId: '', name: '', age: '', specialization: '' });

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createDoctor(form);
    if (res && res.status === 'error') alert(res.message);
    else {
      setForm({ doctorId: '', name: '', age: '', specialization: '' });
      reload();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this doctor record?')) {
      await api.deleteDoctor(id);
      reload();
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Medical Staff</h1>

      <div className="form-card">
        <form onSubmit={submit} className="data-form">
          <div className="input-group">
            <label>Doc ID</label>
            <input required type="number" placeholder="ID" value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Name</label>
            <input required type="text" placeholder="Dr. Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Age</label>
            <input required type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Specialization</label>
            <input required type="text" placeholder="Specialty" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
          </div>
          <button type="submit" className="primary-btn">Add Doctor</button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d, i) => (
              <tr key={i}>
                <td>{d.doctorId}</td>
                <td>Dr. {d.name}</td>
                <td>{d.age}</td>
                <td>{d.specialization}</td>
                <td>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(d.doctorId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== APPOINTMENTS VIEW ====================
function AppointmentsView({ appointments, patients, doctors, reload }) {
  const [form, setForm] = useState({ appointmentId: '', patientId: '', doctorId: '', date: '' });

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createAppointment(form);
    if (res && res.status === 'error') alert(res.message);
    else {
      setForm({ appointmentId: '', patientId: '', doctorId: '', date: '' });
      reload();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Cancel this appointment?')) {
      await api.deleteAppointment(id);
      reload();
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Appointments</h1>

      <div className="form-card">
        <form onSubmit={submit} className="data-form">
          <div className="input-group">
            <label>Appt ID</label>
            <input required type="number" placeholder="ID" value={form.appointmentId} onChange={(e) => setForm({ ...form, appointmentId: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Patient</label>
            <select required value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}>
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p.patientId} value={p.patientId}>{p.name} ({p.patientId})</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Doctor</label>
            <select required value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}>
              <option value="">Select Doctor</option>
              {doctors.map(d => <option key={d.doctorId} value={d.doctorId}>Dr. {d.name} ({d.doctorId})</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Date</label>
            <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <button type="submit" className="primary-btn">Book Appointment</button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, i) => (
              <tr key={i}>
                <td>{a.appointmentId}</td>
                <td>{a.patientName || `PID: ${a.patientId}`}</td>
                <td>{a.doctorName || `DID: ${a.doctorId}`}</td>
                <td>{a.date}</td>
                <td>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(a.appointmentId)}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== BEDS VIEW ====================
function BedsView({ beds, reload }) {
  const [newRoomId, setNewRoomId] = useState('');

  const submitRoom = async (e) => {
    e.preventDefault();
    await api.createRoom(newRoomId, 'BED');
    setNewRoomId('');
    reload();
  };

  const handleAssign = async (id) => {
    const name = window.prompt("Assign bed to patient name:");
    if (name) {
      await api.assignRoom(id, name);
      reload();
    }
  };

  const handleFree = async (id) => {
    await api.freeRoom(id);
    reload();
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Hospital Beds Management</h1>

      <div className="form-card">
        <form onSubmit={submitRoom} className="data-form">
          <div className="input-group">
            <label>New Bed Room ID</label>
            <input required type="number" placeholder="Enter ID" value={newRoomId} onChange={(e) => setNewRoomId(e.target.value)} />
          </div>
          <button type="submit" className="primary-btn">Add Bed</button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Room ID</th>
              <th>Status</th>
              <th>Occupant</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {beds.sort((a, b) => a.roomId - b.roomId).map((r, i) => (
              <tr key={i}>
                <td>{r.roomId}</td>
                <td>
                  <span style={{
                    padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold',
                    background: r.occupied ? '#FEE2E2' : '#DCFCE7', color: r.occupied ? '#991B1B' : '#166534'
                  }}>
                    {r.occupied ? 'Occupied' : 'Available'}
                  </span>
                </td>
                <td>{r.patientName || '-'}</td>
                <td>
                  {!r.occupied ? (
                    <button className="action-btn update-btn" onClick={() => handleAssign(r.roomId)}>Assign</button>
                  ) : (
                    <button className="action-btn delete-btn" onClick={() => handleFree(r.roomId)}>Free</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== OT ROOMS VIEW ====================
function OTRoomsView({ otRooms, reload }) {
  const [newRoomId, setNewRoomId] = useState('');

  const submitRoom = async (e) => {
    e.preventDefault();
    await api.createRoom(newRoomId, 'OT');
    setNewRoomId('');
    reload();
  };

  const handleAssign = async (id) => {
    const name = window.prompt("Assign OT room to patient name:");
    if (name) {
      await api.assignRoom(id, name);
      reload();
    }
  };

  const handleFree = async (id) => {
    await api.freeRoom(id);
    reload();
  };

  return (
    <div className="page-container">
      <h1 className="page-title">OT Rooms Management</h1>

      <div className="form-card">
        <form onSubmit={submitRoom} className="data-form">
          <div className="input-group">
            <label>New OT Room ID</label>
            <input required type="number" placeholder="Enter ID" value={newRoomId} onChange={(e) => setNewRoomId(e.target.value)} />
          </div>
          <button type="submit" className="primary-btn">Add OT Room</button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Room ID</th>
              <th>Status</th>
              <th>Occupant</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {otRooms.sort((a, b) => a.roomId - b.roomId).map((r, i) => (
              <tr key={i}>
                <td>{r.roomId}</td>
                <td>
                  <span style={{
                    padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold',
                    background: r.occupied ? '#FEE2E2' : '#DCFCE7', color: r.occupied ? '#991B1B' : '#166534'
                  }}>
                    {r.occupied ? 'In Use' : 'Available'}
                  </span>
                </td>
                <td>{r.patientName || '-'}</td>
                <td>
                  {!r.occupied ? (
                    <button className="action-btn update-btn" onClick={() => handleAssign(r.roomId)}>Assign</button>
                  ) : (
                    <button className="action-btn delete-btn" onClick={() => handleFree(r.roomId)}>Free</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== MEDICAL RECORDS VIEW ====================
function MedicalRecordsView({ records, reload, patients, doctors }) {
  const [form, setForm] = useState({ recordId: '', patientName: '', doctorName: '', diagnosis: '', treatment: '', date: '' });

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createRecord(form);
    if (res && res.status === 'error') alert(res.message);
    else {
      setForm({ recordId: '', patientName: '', doctorName: '', diagnosis: '', treatment: '', date: '' });
      reload();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this record?')) {
      await api.deleteRecord(id);
      reload();
    }
  };

  const handleUpdate = async (id) => {
    const diag = window.prompt("New Diagnosis:");
    const treat = window.prompt("New Treatment:");
    if (diag && treat) {
      await api.updateRecord(id, diag, treat);
      reload();
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Medical Records</h1>

      <div className="form-card">
        <form onSubmit={submit} className="data-form">
          <div className="input-group">
            <label>Record ID</label>
            <input required type="number" placeholder="ID" value={form.recordId} onChange={(e) => setForm({ ...form, recordId: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Patient</label>
            <select required value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })}>
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p.patientId} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Doctor</label>
            <select required value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })}>
              <option value="">Select Doctor</option>
              {doctors.map(d => <option key={d.doctorId} value={d.name}>Dr. {d.name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Diagnosis</label>
            <input required type="text" placeholder="Diagnosis" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Treatment</label>
            <input required type="text" placeholder="Treatment Plan" value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Date</label>
            <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <button type="submit" className="primary-btn">Add Record</button>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Diagnosis</th>
              <th>Treatment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td>{r.recordId}</td>
                <td>{r.patientName}</td>
                <td>{r.diagnosis}</td>
                <td>{r.treatment}</td>
                <td>
                  <button className="action-btn update-btn" onClick={() => handleUpdate(r.recordId)}>Update</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(r.recordId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== BILLING VIEW ====================
function BillingView({ bills, reload }) {
  const [form, setForm] = useState({ billId: '', patientName: '', treatment: '', amount: '', insuranceStatus: 'Paid' });
  const [searchTerm, setSearchTerm] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await api.createBill(form);
    setForm({ billId: '', patientName: '', treatment: '', amount: '', insuranceStatus: 'Paid' });
    reload();
  };

  const filteredBills = bills.filter(b =>
    b.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Hospital Billing</h1>

      <div className="form-card">
        <form onSubmit={submit} className="data-form">
          <div className="input-group"><label>Bill ID</label><input required type="number" value={form.billId} onChange={e => setForm({ ...form, billId: e.target.value })} /></div>
          <div className="input-group"><label>Patient</label><input required type="text" value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} /></div>
          <div className="input-group"><label>Treatment</label><input required type="text" value={form.treatment} onChange={e => setForm({ ...form, treatment: e.target.value })} /></div>
          <div className="input-group"><label>Amount ($)</label><input required type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
          <div className="input-group">
            <label>Status</label>
            <select value={form.insuranceStatus} onChange={e => setForm({ ...form, insuranceStatus: e.target.value })}>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Insurance Claim">Insurance Claim</option>
            </select>
          </div>
          <button type="submit" className="primary-btn">Generate Bill</button>
        </form>
      </div>

      <div className="table-container">
        <div style={{ padding: '15px', borderBottom: '1px solid #E2E8F0' }}>
          <input
            type="text"
            placeholder="Search by patient name..."
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Treatment</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((b, i) => (
              <tr key={i}>
                <td>{b.billId}</td>
                <td>{b.patientName}</td>
                <td>{b.treatment}</td>
                <td>${(parseFloat(b.amount) || 0).toFixed(2)}</td>
                <td><span className={`status-badge ${b.insuranceStatus === 'Paid' ? 'status-available' : 'status-warning'}`}>{b.insuranceStatus}</span></td>
                <td><button className="action-btn delete-btn" onClick={() => api.deleteBill(b.billId).then(reload)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ==================== PHARMACY VIEW ====================
function PharmacyView({ medicines, reload }) {
  const [form, setForm] = useState({ medicineId: '', name: '', stock: '', price: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await api.createMedicine(form);
    setForm({ medicineId: '', name: '', stock: '', price: '' });
    reload();
  };

  const handleUpdate = async (m) => {
    const newStock = window.prompt(`Update Stock for ${m.name}:`, m.stock);
    const newPrice = window.prompt(`Update Price ($) for ${m.name}:`, m.price);

    if (newStock !== null && newPrice !== null) {
      await api.updateMedicine(m.medicineId, parseInt(newStock), parseFloat(newPrice));
      reload();
    }
  };

  const filteredMeds = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Pharmacy Management</h1>

      <div className="form-card">
        <form onSubmit={submit} className="data-form">
          <div className="input-group"><label>Med ID</label><input required type="number" value={form.medicineId} onChange={e => setForm({ ...form, medicineId: e.target.value })} /></div>
          <div className="input-group"><label>Medicine Name</label><input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="input-group"><label>Stock Qty</label><input required type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></div>
          <div className="input-group"><label>Price ($)</label><input required type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
          <button type="submit" className="primary-btn">Add Medicine</button>
        </form>
      </div>

      <div className="table-container">
        <div style={{ padding: '15px', borderBottom: '1px solid #E2E8F0' }}>
          <input
            type="text"
            placeholder="Search medicine by name..."
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMeds.map((m, i) => (
              <tr key={i}>
                <td>{m.medicineId}</td>
                <td>{m.name}</td>
                <td style={{ color: m.stock <= 10 ? '#DC2626' : 'inherit', fontWeight: m.stock <= 10 ? 'bold' : 'normal' }}>
                  {m.stock} {m.stock <= 10 && ' (LOW)'}
                </td>
                <td>${(parseFloat(m.price) || 0).toFixed(2)}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button className="action-btn" style={{ backgroundColor: '#0D9488' }} onClick={() => handleUpdate(m)}>Update</button>
                  <button className="action-btn delete-btn" onClick={() => api.deleteMedicine(m.medicineId).then(reload)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== LAB VIEW ====================
function LabView({ tests, reload, patients = [] }) {
  const [form, setForm] = useState({ testId: '', patientName: '', testType: '', result: '', date: '', time: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await api.createTest(form);
    setForm({ testId: '', patientName: '', testType: '', result: '', date: '', time: '' });
    reload();
  };

  const handleUpdate = async (t) => {
    const newResult = window.prompt(`Update Result for ${t.patientName} (${t.testType}):`, t.result);
    if (newResult !== null) {
      await api.updateTest(t.testId, newResult);
      reload();
    }
  };

  const filteredTests = tests.filter(t =>
    t.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Lab Tests & Diagnostics</h1>

      <div className="form-card">
        <form onSubmit={submit} className="data-form">
          <div className="input-group"><label>Test ID</label><input required type="number" value={form.testId} onChange={e => setForm({ ...form, testId: e.target.value })} /></div>
          <div className="input-group">
            <label>Patient</label>
            <select required value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })}>
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p.patientId} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div className="input-group"><label>Type</label><input required type="text" placeholder="e.g. Blood Test" value={form.testType} onChange={e => setForm({ ...form, testType: e.target.value })} /></div>
          <div className="input-group"><label>Result</label><input required type="text" placeholder="Result/Status" value={form.result} onChange={e => setForm({ ...form, result: e.target.value })} /></div>
          <div className="input-group"><label>Date</label><input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
          <button type="submit" className="primary-btn">Save Report</button>
        </form>
      </div>

      <div className="table-container">
        <div style={{ padding: '15px', borderBottom: '1px solid #E2E8F0' }}>
          <input
            type="text"
            placeholder="Search tests by patient name..."
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Test Type</th>
              <th>Result</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map((t, i) => (
              <tr key={i}>
                <td>{t.testId}</td>
                <td>{t.patientName}</td>
                <td>{t.testType}</td>
                <td><span className="status-badge status-info">{t.result}</span></td>
                <td>{t.date}</td>
                <td>
                  <button className="action-btn" style={{ backgroundColor: '#0D9488' }} onClick={() => handleUpdate(t)}>Update</button>
                </td>
              </tr>
            ))}
            {filteredTests.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No matching lab records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== OPERATIONS VIEW ====================
function OperationsView({ operations, reload, patients = [], doctors = [], otRooms = [] }) {
  const [form, setForm] = useState({ operationId: '', patientName: '', doctorName: '', roomId: '', date: '', time: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createOperation(form);
    if (res && res.status === 'error') {
      alert(res.message);
    } else {
      setForm({ operationId: '', patientName: '', doctorName: '', roomId: '', date: '', time: '' });
      reload();
    }
  };

  const updateStatus = async (id, current) => {
    const statuses = ['Scheduled', 'In Progress', 'Completed'];
    const index = statuses.indexOf(current);
    const nextStatus = statuses[(index + 1) % statuses.length];

    if (window.confirm(`Update status from ${current} to ${nextStatus}?`)) {
      await api.updateOperationStatus(id, nextStatus);
      if (nextStatus === 'Completed') alert("Operation completed. Room has been freed.");
      reload();
    }
  };

  const filteredOps = operations.filter(op =>
    op.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Surgical Operations</h1>

      <div className="form-card">
        <form onSubmit={submit} className="data-form">
          <div className="input-group"><label>ID</label><input required type="number" value={form.operationId} onChange={e => setForm({ ...form, operationId: e.target.value })} /></div>
          <div className="input-group">
            <label>Patient</label>
            <select required value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })}>
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p.patientId} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Surgeon</label>
            <select required value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })}>
              <option value="">Select Doctor</option>
              {doctors.map(d => <option key={d.doctorId} value={d.name}>Dr. {d.name} ({d.specialization})</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>OT Room</label>
            <select required value={form.roomId} onChange={e => setForm({ ...form, roomId: e.target.value })}>
              <option value="">Select Room</option>
              {otRooms.map(r => <option key={r.roomId} value={r.roomId}>Room {r.roomId} {r.occupied ? '(In Use)' : ''}</option>)}
            </select>
          </div>
          <div className="input-group"><label>Date</label><input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
          <button type="submit" className="primary-btn">Schedule</button>
        </form>
      </div>

      <div className="table-container">
        <div style={{ padding: '15px', borderBottom: '1px solid #E2E8F0' }}>
          <input
            type="text"
            placeholder="Search surgeries by patient name..."
            className="search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Surgeon</th>
              <th>Room</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOps.map((op, i) => (
              <tr key={i}>
                <td>{op.operationId}</td>
                <td>{op.patientName}</td>
                <td>Dr. {op.doctorName}</td>
                <td><span className="status-badge status-warning">Room {op.roomId}</span></td>
                <td>
                  <span className={`status-badge ${op.status === 'Completed' ? 'status-available' :
                      op.status === 'In Progress' ? 'status-warning' : 'status-info'
                    }`}>
                    {op.status || 'Scheduled'}
                  </span>
                </td>
                <td>{op.date}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button className="action-btn" style={{ backgroundColor: '#0D9488' }} onClick={() => updateStatus(op.operationId, op.status || 'Scheduled')}>Update</button>
                  <button className="action-btn delete-btn" onClick={() => api.deleteOperation(op.operationId).then(reload)}>Cancel</button>
                </td>
              </tr>
            ))}
            {filteredOps.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No matching surgeries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
