import React, { useState, useEffect } from 'react';
import './index.css';
import * as api from './api';

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [records, setRecords] = useState([]);

  const loadData = async () => {
    try {
      const p = await api.fetchPatients();
      const d = await api.fetchDoctors();
      const a = await api.fetchAppointments();
      const r = await api.fetchRooms();
      const recs = await api.fetchRecords();
      setPatients(p);
      setDoctors(d);
      setAppointments(a);
      setRooms(r);
      setRecords(recs);
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
          {['Dashboard', 'Patients', 'Doctors', 'Appointments', 'Rooms', 'Records'].map((tab) => (
            <button
              key={tab}
              className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Dashboard' && 'Clinical Dashboard'}
              {tab === 'Patients' && 'Patient Records'}
              {tab === 'Doctors' && 'Medical Staff'}
              {tab === 'Appointments' && 'Appointments'}
              {tab === 'Rooms' && 'Room Management'}
              {tab === 'Records' && 'Medical Records'}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'Dashboard' && <Dashboard patients={patients} doctors={doctors} appointments={appointments} rooms={rooms} records={records} reload={loadData} />}
        {activeTab === 'Patients' && <PatientsView patients={patients} reload={loadData} />}
        {activeTab === 'Doctors' && <DoctorsView doctors={doctors} reload={loadData} />}
        {activeTab === 'Appointments' && <AppointmentsView appointments={appointments} reload={loadData} />}
        {activeTab === 'Rooms' && <RoomsView rooms={rooms} reload={loadData} />}
        {activeTab === 'Records' && <MedicalRecordsView records={records} reload={loadData} patients={patients} doctors={doctors} />}
      </main>
    </div>
  );
}

function Dashboard({ patients, doctors, appointments, rooms = [], records = [], reload }) {
  const availableRooms = rooms.filter(r => !r.occupied).length;

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
      <div className="metric-cards">
        <div className="metric-card">
          <p className="metric-title">Total Patients</p>
          <p className="metric-value">{patients.length}</p>
        </div>
        <div className="metric-card">
          <p className="metric-title">Total Doctors</p>
          <p className="metric-value">{doctors.length}</p>
        </div>
        <div className="metric-card">
          <p className="metric-title">Appointments</p>
          <p className="metric-value">{appointments.length}</p>
        </div>
        <div className="metric-card">
          <p className="metric-title">Available Rooms</p>
          <p className="metric-value">{availableRooms} / {rooms.length}</p>
        </div>
        <div className="metric-card">
          <p className="metric-title">Medical Records</p>
          <p className="metric-value">{records.length}</p>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#1E293B', marginBottom: '15px' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={handleAdmit} className="primary-btn" style={{ background: '#0F172A', minWidth: '150px' }}>
            + Admit Patient
          </button>
          <button onClick={handleDischarge} className="primary-btn" style={{ background: '#EF4444', minWidth: '150px' }}>
            - Discharge Patient
          </button>
        </div>
      </div>
    </div>
  );
}

function PatientsView({ patients, reload }) {
  const [form, setForm] = useState({ patientId: '', name: '', age: '', disease: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createPatient(form);
    if (res && res.status === 'error') {
        alert(res.message || "An error occurred");
        return;
    }
    setForm({ patientId: '', name: '', age: '', disease: '' });
    reload();
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this patient?')) {
        await api.deletePatient(id);
        reload();
    }
  };

  const handleUpdate = async (id) => {
    const newDisease = window.prompt("Enter the updated disease for this patient:");
    if(newDisease && newDisease.trim() !== '') {
        await api.updatePatient(id, newDisease);
        reload();
    }
  };

  const [searchType, setSearchType] = useState('id');

  const filteredPatients = patients.filter(p => {
      if (!searchQuery) return true;
      if (searchType === 'id') return p.patientId.toString().includes(searchQuery);
      if (searchType === 'name') return p.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (searchType === 'disease') return p.disease.toLowerCase().includes(searchQuery.toLowerCase());
      return true;
  }).sort((a, b) => a.patientId - b.patientId);

  return (
    <div className="page-container">
      <h1 className="page-title">Patient Records</h1>
      
      <div className="form-card">
        <form onSubmit={submit} className="data-form">
          <div className="input-group">
            <label>ID</label>
            <input required type="number" value={form.patientId} onChange={(e) => setForm({...form, patientId: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Name</label>
            <input required type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Age</label>
            <input required type="number" value={form.age} onChange={(e) => setForm({...form, age: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Disease</label>
            <input required type="text" value={form.disease} onChange={(e) => setForm({...form, disease: e.target.value})} />
          </div>
          <button className="primary-btn" type="submit">Add Patient</button>
        </form>
      </div>

      <div className="table-container">
        <div style={{ padding: '15px 20px', background: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px' }}
            >
              <option value="id">Search by ID</option>
              <option value="name">Search by Name</option>
              <option value="disease">Search by Disease</option>
            </select>
            <input 
              type="text" 
              placeholder={`Search...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', width: '250px' }}
            />
        </div>
        <table>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Disease</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(p => (
              <tr key={p.patientId}>
                <td>{p.patientId}</td>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.disease}</td>
                <td>
                  <button onClick={() => handleUpdate(p.patientId)} className="action-btn update-btn">Update</button>
                  <button onClick={() => handleDelete(p.patientId)} className="action-btn delete-btn">Delete</button>
                </td>
              </tr>
            ))}
            {filteredPatients.length === 0 && (
              <tr><td colSpan="5" style={{textAlign: 'center', color: '#64748B'}}>No patients found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DoctorsView({ doctors, reload }) {
  const [form, setForm] = useState({ doctorId: '', name: '', age: '', specialization: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createDoctor(form);
    if (res && res.status === 'error') {
        alert(res.message || "An error occurred");
        return;
    }
    setForm({ doctorId: '', name: '', age: '', specialization: '' });
    reload();
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this doctor?')) {
        await api.deleteDoctor(id);
        reload();
    }
  };

  const [searchType, setSearchType] = useState('name');

  const filteredDoctors = doctors.filter(d => {
      if (!searchQuery) return true;
      if (searchType === 'name') return d.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (searchType === 'specialization') return d.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      return true;
  }).sort((a, b) => a.doctorId - b.doctorId);

  return (
    <div className="page-container">
      <h1 className="page-title">Medical Staff</h1>
      
      <div className="form-card">
        <form onSubmit={submit} className="data-form">
          <div className="input-group">
            <label>Doctor ID</label>
            <input required type="number" value={form.doctorId} onChange={(e) => setForm({...form, doctorId: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Name</label>
            <input required type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Age</label>
            <input required type="number" value={form.age} onChange={(e) => setForm({...form, age: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Specialization</label>
            <input required type="text" value={form.specialization} onChange={(e) => setForm({...form, specialization: e.target.value})} />
          </div>
          <button className="primary-btn" type="submit">Add Doctor</button>
        </form>
      </div>

      <div className="table-container">
        <div style={{ padding: '15px 20px', background: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px' }}
            >
              <option value="name">Search by Name</option>
              <option value="specialization">Search by Specialization</option>
            </select>
            <input 
              type="text" 
              placeholder={`Search...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', width: '250px' }}
            />
        </div>
        <table>
          <thead>
            <tr>
              <th>Doctor ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map(d => (
              <tr key={d.doctorId}>
                <td>{d.doctorId}</td>
                <td>{d.name}</td>
                <td>{d.age}</td>
                <td>{d.specialization}</td>
                <td>
                  <button onClick={() => handleDelete(d.doctorId)} className="action-btn delete-btn">Delete</button>
                </td>
              </tr>
            ))}
            {filteredDoctors.length === 0 && (
              <tr><td colSpan="5" style={{textAlign: 'center', color: '#64748B'}}>No doctors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AppointmentsView({ appointments, reload }) {
  const [form, setForm] = useState({ appointmentId: '', patientId: '', doctorId: '', date: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createAppointment(form);
    if (res && res.status === 'error') {
        alert(res.message || "An error occurred");
        return;
    }
    setForm({ appointmentId: '', patientId: '', doctorId: '', date: '' });
    reload();
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to cancel this appointment?')) {
        await api.deleteAppointment(id);
        reload();
    }
  };

  const filteredAppointments = appointments.filter(a => a.appointmentId.toString().includes(searchQuery)).sort((a, b) => a.appointmentId - b.appointmentId);

  return (
    <div className="page-container">
      <h1 className="page-title">Appointments</h1>
      
      <div className="form-card">
        <form onSubmit={submit} className="data-form">
          <div className="input-group">
            <label>Appt ID</label>
            <input required type="number" value={form.appointmentId} onChange={(e) => setForm({...form, appointmentId: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Patient ID</label>
            <input required type="number" value={form.patientId} onChange={(e) => setForm({...form, patientId: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Doctor ID</label>
            <input required type="number" value={form.doctorId} onChange={(e) => setForm({...form, doctorId: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Date</label>
            <input required type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
          </div>
          <button className="primary-btn" type="submit">Book Appt</button>
        </form>
      </div>

      <div className="table-container">
        <div style={{ padding: '15px 20px', background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
            <input 
              type="text" 
              placeholder="Search by Appointment ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', width: '250px' }}
            />
        </div>
        <table>
          <thead>
            <tr>
              <th>Appt ID</th>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(a => (
              <tr key={a.appointmentId}>
                <td>{a.appointmentId}</td>
                <td>{a.patientName}</td>
                <td>{a.doctorName}</td>
                <td>{a.date}</td>
                <td>
                  <button onClick={() => handleDelete(a.appointmentId)} className="action-btn delete-btn">Delete</button>
                </td>
              </tr>
            ))}
            {filteredAppointments.length === 0 && (
              <tr><td colSpan="5" style={{textAlign: 'center', color: '#64748B'}}>No appointments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoomsView({ rooms, reload }) {
  const [form, setForm] = useState({ roomId: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createRoom(form.roomId);
    if (res && res.status === 'error') {
        alert(res.message || "An error occurred");
        return;
    }
    setForm({ roomId: '' });
    reload();
  };

  const handleAssign = async (id) => {
    const patientName = window.prompt("Enter Patient Name:");
    if (!patientName) return;
    const res = await api.assignRoom(id, patientName);
    if (res && res.status === 'error') alert(res.message);
    reload();
  };

  const handleFree = async (id) => {
    const res = await api.freeRoom(id);
    if (res && res.status === 'error') alert(res.message);
    reload();
  };

  const filteredRooms = rooms.filter(r => r.roomId.toString().includes(searchQuery)).sort((a, b) => a.roomId - b.roomId);

  return (
    <div className="page-container">
      <h1 className="page-title">Room Management</h1>
      
      <div className="form-card">
        <form onSubmit={submit} className="data-form">
          <div className="input-group">
            <label>Room ID</label>
            <input required type="number" value={form.roomId} onChange={(e) => setForm({...form, roomId: e.target.value})} />
          </div>
          <button className="primary-btn" type="submit">Add Room</button>
        </form>
      </div>

      <div className="table-container">
        <div style={{ padding: '15px 20px', background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
            <input 
              type="text" 
              placeholder="Search by Room ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', width: '250px' }}
            />
        </div>
        <table>
          <thead>
            <tr>
              <th>Room ID</th>
              <th>Status</th>
              <th>Patient</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.map(r => (
              <tr key={r.roomId}>
                <td>{r.roomId}</td>
                <td>
                  <span style={{
                    padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 'bold',
                    background: r.occupied ? '#FEE2E2' : '#DCFCE7', color: r.occupied ? '#991B1B' : '#166534'
                  }}>
                    {r.occupied ? 'Occupied' : 'Available'}
                  </span>
                </td>
                <td>{r.patientName || '-'}</td>
                <td>
                  {!r.occupied && <button onClick={() => handleAssign(r.roomId)} className="action-btn update-btn" style={{ marginRight: '10px' }}>Assign</button>}
                  {r.occupied && <button onClick={() => handleFree(r.roomId)} className="action-btn delete-btn">Free Room</button>}
                </td>
              </tr>
            ))}
            {filteredRooms.length === 0 && (
              <tr><td colSpan="4" style={{textAlign: 'center', color: '#64748B'}}>No rooms found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MedicalRecordsView({ records, reload, patients, doctors }) {
  const [form, setForm] = useState({ recordId: '', patientName: '', doctorName: '', diagnosis: '', treatment: '', date: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('patient');

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createRecord(form);
    if (res && res.status === 'error') {
      alert(res.message || "An error occurred");
      return;
    }
    setForm({ recordId: '', patientName: '', doctorName: '', diagnosis: '', treatment: '', date: '' });
    reload();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this medical record?')) {
      await api.deleteRecord(id);
      reload();
    }
  };

  const handleUpdate = async (id) => {
    const diag = window.prompt("Enter updated diagnosis:");
    const treat = window.prompt("Enter updated treatment:");
    if (diag && treat) {
      await api.updateRecord(id, diag, treat);
      reload();
    }
  };

  const filteredRecords = records.filter(r => {
    if (!searchQuery) return true;
    if (searchType === 'id') return r.recordId.toString().includes(searchQuery);
    if (searchType === 'patient') return r.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    return true;
  }).sort((a, b) => a.recordId - b.recordId);

  return (
    <div className="page-container">
      <h1 className="page-title">Medical Records</h1>

      <div className="form-card">
        <form onSubmit={submit} className="data-form">
          <div className="input-group">
            <label>Record ID</label>
            <input required type="number" value={form.recordId} onChange={(e) => setForm({ ...form, recordId: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Patient Name</label>
            <select required value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })}>
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p.patientId} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Doctor Name</label>
            <select required value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })}>
              <option value="">Select Doctor</option>
              {doctors.map(d => <option key={d.doctorId} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Diagnosis</label>
            <input required type="text" value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Treatment</label>
            <input required type="text" value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} />
          </div>
          <div className="input-group">
            <label>Date</label>
            <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <button className="primary-btn" type="submit">Add Record</button>
        </form>
      </div>

      <div className="table-container">
        <div style={{ padding: '15px 20px', background: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
            <option value="patient">Search by Patient</option>
            <option value="id">Search by Record ID</option>
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
              <th>Record ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Diagnosis</th>
              <th>Treatment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map(r => (
              <tr key={r.recordId}>
                <td>{r.recordId}</td>
                <td>{r.patientName}</td>
                <td>{r.doctorName}</td>
                <td>{r.diagnosis}</td>
                <td>{r.treatment}</td>
                <td>{r.date}</td>
                <td>
                  <button onClick={() => handleUpdate(r.recordId)} className="action-btn update-btn" style={{ marginRight: '10px' }}>Update</button>
                  <button onClick={() => handleDelete(r.recordId)} className="action-btn delete-btn">Delete</button>
                </td>
              </tr>
            ))}
            {filteredRecords.length === 0 && (
              <tr><td colSpan="7" style={{ textAlign: 'center', color: '#64748B' }}>No medical records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
