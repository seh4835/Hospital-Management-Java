import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import * as api from './api';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  LayoutDashboard, Users, UserRound, CalendarDays, Scissors,
  BedDouble, DoorOpen, FileText, CreditCard, Pill, FlaskConical,
  UserPlus, LogOut, RefreshCw, Activity, Bed, Stethoscope,
  DollarSign, Microscope, PackageX, HeartPulse, CalendarCheck,
  BarChart2, Zap, CheckCircle2, XCircle
} from 'lucide-react';

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
          <div style={{ height: 'calc(100vh - 100px)', overflowY: 'auto', paddingRight: '5px' }}>
            {[
              { key: 'Dashboard',    label: 'Dashboard',       Icon: LayoutDashboard },
              { key: 'Patients',     label: 'Patients',        Icon: Users },
              { key: 'Doctors',      label: 'Doctors',         Icon: Stethoscope },
              { key: 'Appointments', label: 'Schedule',        Icon: CalendarDays },
              { key: 'Operations',   label: 'Operations',      Icon: Scissors },
              { key: 'Beds',         label: 'Hospital Beds',   Icon: BedDouble },
              { key: 'OTRooms',      label: 'OT Rooms',        Icon: DoorOpen },
              { key: 'Records',      label: 'Medical Records', Icon: FileText },
              { key: 'Billing',      label: 'Billing',         Icon: CreditCard },
              { key: 'Pharmacy',     label: 'Pharmacy',        Icon: Pill },
              { key: 'Lab',          label: 'Lab Tests',       Icon: FlaskConical },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                className={`nav-btn ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={16} style={{ opacity: 0.85, flexShrink: 0 }} />
                  {label}
                </div>
              </button>
            ))}
          </div>
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
            otRooms={otRooms}
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
        {activeTab === 'Beds' && <BedsView beds={beds} reload={loadData} patients={patients} />}
        {activeTab === 'OTRooms' && <OTRoomsView otRooms={otRooms} reload={loadData} patients={patients} />}
        {activeTab === 'Records' && <MedicalRecordsView records={records} reload={loadData} patients={patients} doctors={doctors} />}
        {activeTab === 'Billing' && <BillingView bills={bills} reload={loadData} patients={patients} />}
        {activeTab === 'Pharmacy' && <PharmacyView medicines={medicines} reload={loadData} />}
        {activeTab === 'Lab' && <LabView tests={tests} reload={loadData} patients={patients} />}
        {activeTab === 'Operations' && <OperationsView operations={operations} patients={patients} doctors={doctors} otRooms={otRooms} reload={loadData} />}
      </main>
    </div>
  );
}

// ==================== ANIMATED COUNTER ====================
function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const target = parseFloat(value) || 0;
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased * 100) / 100);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <span>{prefix}{typeof value === 'number' && value % 1 !== 0 ? display.toFixed(2) : Math.round(display)}{suffix}</span>;
}

// ==================== STAT CARD ====================
function StatCard({ icon, label, value, prefix, suffix, color, gradient, onClick, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`dash-stat-card ${visible ? 'dash-stat-card--visible' : ''}`}
      style={{ '--card-color': color, '--card-gradient': gradient, cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <div className="dash-stat-icon">{icon}</div>
      <div className="dash-stat-body">
        <p className="dash-stat-label">{label}</p>
        <p className="dash-stat-value" style={{ color }}>
          {visible ? <AnimatedCounter value={value} prefix={prefix} suffix={suffix} /> : (prefix || '') + '0'}
        </p>
      </div>
      <div className="dash-stat-glow" style={{ background: gradient }} />
    </div>
  );
}

// ==================== MINI DONUT ====================
function MiniDonut({ used, total, color }) {
  const free = Math.max(total - used, 0);
  const data = [
    { name: 'Used', value: used },
    { name: 'Free', value: free || 1 },
  ];
  return (
    <PieChart width={80} height={80}>
      <Pie data={data} cx={35} cy={35} innerRadius={24} outerRadius={36} startAngle={90} endAngle={-270} dataKey="value">
        <Cell fill={color} />
        <Cell fill="#E2E8F0" />
      </Pie>
    </PieChart>
  );
}

// ==================== DASHBOARD ====================
function Dashboard({ patients, doctors, appointments, beds = [], otRooms = [], records = [], bills = [], medicines = [], tests = [], operations = [], reload, setActiveTab }) {
  const availableBeds = beds.filter(r => !r.occupied).length;
  const occupiedBeds = beds.length - availableBeds;
  const totalRevenue = bills.reduce((acc, b) => acc + (parseFloat(b.amount) || 0), 0);
  const lowStock = medicines.filter(m => m.stock <= 10).length;
  const pendingBills = bills.filter(b => b.insuranceStatus === 'Pending').length;

  // Chart: Bed Occupancy
  const bedData = [
    { name: 'Occupied', value: occupiedBeds, fill: '#E11D48' },
    { name: 'Available', value: availableBeds || 0, fill: '#0D9488' },
  ];

  // Chart: Billing status breakdown
  const billingData = [
    { name: 'Paid', value: bills.filter(b => b.insuranceStatus === 'Paid').length, fill: '#0D9488' },
    { name: 'Pending', value: pendingBills, fill: '#F59E0B' },
    { name: 'Insurance', value: bills.filter(b => b.insuranceStatus === 'Insurance Claim').length, fill: '#6366F1' },
  ];

  // Chart: Lab test status — all 4 statuses separately
  const labData = [
    { name: 'Completed',   value: tests.filter(t => t.status === 'Completed').length,   fill: '#10B981' },
    { name: 'In Progress', value: tests.filter(t => t.status === 'In Progress').length,  fill: '#3B82F6' },
    { name: 'Pending',     value: tests.filter(t => t.status === 'Pending').length,      fill: '#F59E0B' },
    { name: 'Cancelled',   value: tests.filter(t => t.status === 'Cancelled').length,   fill: '#EF4444' },
  ];

  // Chart: Module bar chart
  const moduleData = [
    { name: 'Patients', count: patients.length, fill: '#6366F1' },
    { name: 'Doctors', count: doctors.length, fill: '#0D9488' },
    { name: 'Appointments', count: appointments.length, fill: '#F59E0B' },
    { name: 'Operations', count: operations.length, fill: '#E11D48' },
    { name: 'Lab', count: tests.length, fill: '#10B981' },
    { name: 'Bills', count: bills.length, fill: '#8B5CF6' },
  ];

  // Build activity feed
  const activity = [
    ...appointments.slice(0, 3).map(a => ({ type: 'Appointment', Icon: CalendarCheck, color: '#0369A1', text: `${a.patientName} → Dr. ${a.doctorName}`, time: a.date, badge: 'status-info' })),
    ...operations.slice(0, 2).map(op => ({ type: 'Surgery', Icon: Scissors, color: '#92400E', text: `${op.patientName} — OT Room ${op.roomId}`, time: op.date, badge: 'status-warning' })),
    ...tests.slice(0, 2).map(t => ({ type: 'Lab Test', Icon: FlaskConical, color: '#166534', text: `${t.patientName}: ${t.testType}`, time: t.date, badge: 'status-available' })),
    ...bills.slice(0, 2).map(b => ({ type: 'Billing', Icon: CreditCard, color: '#5B21B6', text: `${b.patientName} — $${(parseFloat(b.amount)||0).toFixed(2)}`, time: b.insuranceStatus, badge: b.insuranceStatus === 'Paid' ? 'status-available' : 'status-warning' })),
  ].slice(0, 8);

  const handleAdmit = async () => {
    const patientName = window.prompt('Enter Patient Name to Admit:');
    if (!patientName) return;
    const res = await api.admitPatient(patientName);
    if (res && res.status === 'error') alert(res.message);
    else { alert(`Patient ${patientName} successfully admitted!`); reload(); }
  };

  const handleDischarge = async () => {
    const patientName = window.prompt('Enter Patient Name to Discharge:');
    if (!patientName) return;
    const res = await api.dischargePatient(patientName);
    if (res && res.status === 'error') alert(res.message);
    else { alert(`Patient ${patientName} successfully discharged!`); reload(); }
  };

  const COLORS_PIE = ['#E11D48', '#0D9488'];
  const BILL_COLORS = ['#0D9488', '#F59E0B', '#6366F1'];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Clinical Dashboard</h1>
          <p className="dash-subtitle">Real-time hospital operations overview</p>
        </div>
        <div className="dash-header-actions">
          <button className="btn btn-primary dash-action-btn" onClick={handleAdmit}>
            <UserPlus size={16} /> Admit Patient
          </button>
          <button className="btn btn-danger dash-action-btn" onClick={handleDischarge}>
            <LogOut size={16} /> Discharge
          </button>
          <button className="btn btn-secondary dash-action-btn" onClick={reload}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="dash-stats-grid">
        <StatCard
          icon={<Users size={22} color="#fff" />} label="Total Patients" value={patients.length}
          color="#6366F1" gradient="linear-gradient(135deg,#6366F1,#818CF8)"
          onClick={() => setActiveTab('Patients')} delay={0}
        />
        <StatCard
          icon={<Stethoscope size={22} color="#fff" />} label="Medical Staff" value={doctors.length}
          color="#0D9488" gradient="linear-gradient(135deg,#0D9488,#2DD4BF)"
          onClick={() => setActiveTab('Doctors')} delay={80}
        />
        <StatCard
          icon={<BedDouble size={22} color="#fff" />} label="Beds Available" value={availableBeds}
          color={availableBeds === 0 ? '#E11D48' : '#10B981'} gradient="linear-gradient(135deg,#10B981,#6EE7B7)"
          onClick={() => setActiveTab('Beds')} delay={160}
        />
        <StatCard
          icon={<DollarSign size={22} color="#fff" />} label="Total Revenue" value={totalRevenue} prefix="$"
          color="#F59E0B" gradient="linear-gradient(135deg,#F59E0B,#FCD34D)"
          onClick={() => setActiveTab('Billing')} delay={240}
        />
        <StatCard
          icon={<Microscope size={22} color="#fff" />} label="Lab Tests" value={tests.length}
          color="#10B981" gradient="linear-gradient(135deg,#10B981,#34D399)"
          onClick={() => setActiveTab('Lab')} delay={320}
        />
        <StatCard
          icon={<Pill size={22} color="#fff" />} label="Low Stock Items" value={lowStock}
          color={lowStock > 0 ? '#E11D48' : '#0D9488'} gradient={lowStock > 0 ? 'linear-gradient(135deg,#E11D48,#FB7185)' : 'linear-gradient(135deg,#0D9488,#2DD4BF)'}
          onClick={() => setActiveTab('Pharmacy')} delay={400}
        />
        <StatCard
          icon={<HeartPulse size={22} color="#fff" />} label="Scheduled Ops" value={operations.length}
          color="#8B5CF6" gradient="linear-gradient(135deg,#8B5CF6,#C4B5FD)"
          onClick={() => setActiveTab('Operations')} delay={480}
        />
        <StatCard
          icon={<CalendarDays size={22} color="#fff" />} label="Appointments" value={appointments.length}
          color="#3B82F6" gradient="linear-gradient(135deg,#3B82F6,#93C5FD)"
          onClick={() => setActiveTab('Appointments')} delay={560}
        />
      </div>

      {/* Charts Row */}
      <div className="dash-charts-grid">

        {/* Bed Occupancy Donut */}
        <div className="dash-chart-card">
          <div className="dash-chart-header">
            <h3><BedDouble size={16} style={{marginRight:6,verticalAlign:'middle'}}/>Bed Occupancy</h3>
            <span className="dash-chart-badge">{beds.length} Total</span>
          </div>
          <div className="dash-chart-body">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={bedData} cx="50%" cy="50%"
                  innerRadius={55} outerRadius={80}
                  paddingAngle={3} dataKey="value"
                  animationBegin={0} animationDuration={1000}
                >
                  {bedData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} beds`, n]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="dash-donut-center">
              <span className="dash-donut-pct">
                {beds.length ? Math.round((occupiedBeds / beds.length) * 100) : 0}%
              </span>
              <span className="dash-donut-label">Occupied</span>
            </div>
          </div>
        </div>

        {/* Billing Breakdown */}
        <div className="dash-chart-card">
          <div className="dash-chart-header">
            <h3><CreditCard size={16} style={{marginRight:6,verticalAlign:'middle'}}/>Billing Status</h3>
            <span className="dash-chart-badge">{bills.length} Bills</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={billingData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1000}>
                {billingData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lab Test Status - horizontal bar chart for clarity */}
        <div className="dash-chart-card">
          <div className="dash-chart-header">
            <h3><FlaskConical size={16} style={{marginRight:6,verticalAlign:'middle'}}/>Lab Test Status</h3>
            <span className="dash-chart-badge">{tests.length} Tests</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={labData}
              layout="vertical"
              margin={{ top: 8, right: 36, left: 8, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
              <Tooltip formatter={(v, n) => [`${v} test${v !== 1 ? 's' : ''}`, n]} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={1000} label={{ position: 'right', fontSize: 12, fill: '#64748B' }}>
                {labData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Module Overview Bar */}
        <div className="dash-chart-card dash-chart-card--wide">
          <div className="dash-chart-header">
            <h3><BarChart2 size={16} style={{marginRight:6,verticalAlign:'middle'}}/>Hospital Modules Overview</h3>
            <span className="dash-chart-badge">All Modules</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={moduleData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={1200}>
                {moduleData.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Maps Column + Activity Feed */}
      <div className="dash-bottom-grid">

        {/* Left column: Bed Map + OT Room Map stacked */}
        <div className="dash-maps-col">

          {/* Bed Map */}
          <div className="dash-panel">
            <div className="dash-chart-header">
              <h3><BedDouble size={16} style={{marginRight:6,verticalAlign:'middle'}}/>Bed Map</h3>
              <span className="dash-chart-badge">{availableBeds} Free</span>
            </div>
            <div className="dash-bed-grid">
              {beds.length === 0 && <p style={{ color: '#94A3B8', fontStyle: 'italic' }}>No beds registered.</p>}
              {beds.sort((a, b) => a.roomId - b.roomId).map(bed => (
                <div
                  key={bed.roomId}
                  className={`dash-bed-cell ${bed.occupied ? 'dash-bed-cell--occupied' : 'dash-bed-cell--free'}`}
                  title={bed.occupied ? `Bed ${bed.roomId} — ${bed.patientName || 'Patient'}` : `Bed ${bed.roomId} — Available`}
                  onClick={() => setActiveTab('Beds')}
                >
                  <span className="dash-bed-icon">{bed.occupied ? <Bed size={20}/> : <CheckCircle2 size={20}/>}</span>
                  <span className="dash-bed-id">#{bed.roomId}</span>
                  {bed.occupied && <span className="dash-bed-patient">{(bed.patientName || 'P').substring(0, 6)}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* OT Room Map */}
          <div className="dash-panel">
            <div className="dash-chart-header">
              <h3><DoorOpen size={16} style={{marginRight:6,verticalAlign:'middle'}}/>OT Room Map</h3>
              <span className="dash-chart-badge">{otRooms.filter(r => !r.occupied).length} Free</span>
            </div>
            <div className="dash-bed-grid">
              {otRooms.length === 0 && <p style={{ color: '#94A3B8', fontStyle: 'italic' }}>No OT rooms registered.</p>}
              {otRooms.sort((a, b) => a.roomId - b.roomId).map(room => (
                <div
                  key={room.roomId}
                  className={`dash-bed-cell ${room.occupied ? 'dash-bed-cell--ot-occupied' : 'dash-bed-cell--ot-free'}`}
                  title={room.occupied ? `OT Room ${room.roomId} — ${room.patientName || 'In Use'}` : `OT Room ${room.roomId} — Available`}
                  onClick={() => setActiveTab('OTRooms')}
                >
                  <span className="dash-bed-icon">{room.occupied ? <XCircle size={20}/> : <CheckCircle2 size={20}/>}</span>
                  <span className="dash-bed-id">#{room.roomId}</span>
                  {room.occupied && <span className="dash-bed-patient">{(room.patientName || 'P').substring(0, 6)}</span>}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Live Activity Feed */}
        <div className="dash-panel">
          <div className="dash-chart-header">
            <h3><Zap size={16} style={{marginRight:6,verticalAlign:'middle'}}/>Live Activity Feed</h3>
            <span className="dash-chart-badge">{activity.length} Events</span>
          </div>
          <div className="dash-activity-feed">
            {activity.length === 0 && (
              <div className="dash-empty">No recent activity. Add patients, appointments or operations to see updates here.</div>
            )}
            {activity.map((item, i) => (
              <div key={i} className="dash-activity-item" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="dash-activity-icon">
                  <item.Icon size={18} color={item.color} />
                </span>
                <div className="dash-activity-content">
                  <p className="dash-activity-text">{item.text}</p>
                  <span className={`status-badge ${item.badge}`}>{item.type}</span>
                </div>
                <span className="dash-activity-time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}


// ==================== PATIENTS VIEW ====================
function PatientsView({ patients, reload }) {
  const [form, setForm] = useState({ name: '', age: '', disease: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('name');

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createPatient(form);
    if (res && res.status === 'error') {
      alert(res.message);
    } else {
      setForm({ name: '', age: '', disease: '' });
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
// ==================== DOCTORS VIEW ====================
function DoctorsView({ doctors, reload }) {
  const [form, setForm] = useState({ name: '', age: '', specialization: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createDoctor(form);
    if (res && res.status === 'error') alert(res.message);
    else {
      setForm({ name: '', age: '', specialization: '' });
      reload();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this doctor record?')) {
      await api.deleteDoctor(id);
      reload();
    }
  };

  const filtered = doctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Medical Staff</h1>

      <div className="form-card">
        <form onSubmit={submit} className="data-form">
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
        <div style={{ padding: '15px 20px', borderBottom: '1px solid #E2E8F0' }}>
          <input
            type="text"
            placeholder="Search doctor by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
          />
        </div>
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
            {filtered.map((d, i) => (
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
  const [form, setForm] = useState({ patientId: '', doctorId: '', date: '' });

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createAppointment(form);
    if (res && res.status === 'error') alert(res.message);
    else {
      setForm({ patientId: '', doctorId: '', date: '' });
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
function BedsView({ beds, reload, patients = [] }) {
  const [assigningTo, setAssigningTo] = useState({});

  const submitRoom = async (e) => {
    e.preventDefault();
    await api.createRoom(null, 'BED');
    reload();
  };

  const handleAssign = async (id, name) => {
    if (name) {
      await api.assignRoom(id, name, 'BED');
      setAssigningTo({ ...assigningTo, [id]: undefined });
      reload();
    }
  };

  const handleFree = async (id) => {
    await api.freeRoom(id, 'BED');
    reload();
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Hospital Beds Management</h1>

      <div className="form-card">
        <form onSubmit={submitRoom} className="data-form">
          <button type="submit" className="primary-btn">Add New Bed</button>
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
                <td>
                  <select 
                    style={{ padding: '4px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                    onChange={(e) => setAssigningTo({ ...assigningTo, [r.roomId]: e.target.value })}
                    value={assigningTo[r.roomId] !== undefined ? assigningTo[r.roomId] : (r.patientName || '')}
                  >
                    <option value="">Select Patient</option>
                    {patients.map(p => <option key={p.patientId} value={p.name}>{p.name}</option>)}
                  </select>
                </td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="action-btn update-btn" 
                    onClick={() => handleAssign(r.roomId, assigningTo[r.roomId] || r.patientName)}
                    disabled={!assigningTo[r.roomId] && !r.patientName}
                  >
                    {r.occupied ? 'Update' : 'Assign'}
                  </button>
                  {r.occupied && (
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
function OTRoomsView({ otRooms, reload, patients = [] }) {
  const [assigningTo, setAssigningTo] = useState({});

  const submitRoom = async (e) => {
    e.preventDefault();
    await api.createRoom(null, 'OT');
    reload();
  };

  const handleAssign = async (id, name) => {
    if (name) {
      await api.assignRoom(id, name, 'OT'); // Pass type hint
      setAssigningTo({ ...assigningTo, [id]: undefined });
      reload();
    }
  };

  const handleFree = async (id) => {
    await api.freeRoom(id, 'OT');
    reload();
  };

  return (
    <div className="page-container">
      <h1 className="page-title">OT Rooms Management</h1>

      <div className="form-card">
        <form onSubmit={submitRoom} className="data-form">
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
                <td>
                  <select 
                    style={{ padding: '4px', borderRadius: '4px', border: '1px solid #CBD5E1' }}
                    onChange={(e) => setAssigningTo({ ...assigningTo, [r.roomId]: e.target.value })}
                    value={assigningTo[r.roomId] !== undefined ? assigningTo[r.roomId] : (r.patientName || '')}
                  >
                    <option value="">Select Patient</option>
                    {patients.map(p => <option key={p.patientId} value={p.name}>{p.name}</option>)}
                  </select>
                </td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="action-btn update-btn" 
                    onClick={() => handleAssign(r.roomId, assigningTo[r.roomId] || r.patientName)}
                    disabled={!assigningTo[r.roomId] && !r.patientName}
                  >
                    {r.occupied ? 'Update' : 'Assign'}
                  </button>
                  {r.occupied && (
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
  const [form, setForm] = useState({ patientName: '', doctorName: '', diagnosis: '', treatment: '', date: '' });

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createRecord(form);
    if (res && res.status === 'error') alert(res.message);
    else {
      setForm({ patientName: '', doctorName: '', diagnosis: '', treatment: '', date: '' });
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
function BillingView({ bills, reload, patients = [] }) {
  const [form, setForm] = useState({ patientName: '', treatment: '', amount: '', insuranceStatus: 'Paid' });
  const [searchTerm, setSearchTerm] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await api.createBill(form);
    setForm({ patientName: '', treatment: '', amount: '', insuranceStatus: 'Paid' });
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
          <div className="input-group">
            <label>Patient</label>
            <select required value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })}>
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p.patientId} value={p.name}>{p.name}</option>)}
            </select>
          </div>
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
  const [form, setForm] = useState({ name: '', stock: '', price: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await api.createMedicine(form);
    setForm({ name: '', stock: '', price: '' });
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
  const [form, setForm] = useState({ patientName: '', testType: '', status: 'Pending', date: '', time: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await api.createTest(form);
    setForm({ patientName: '', testType: '', status: 'Pending', date: '', time: '' });
    reload();
  };

  const handleUpdate = async (id, newStatus) => {
    await api.updateTest(id, newStatus);
    reload();
  };

  const filteredTests = tests.filter(t =>
    t.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Lab Tests & Diagnostics</h1>

      <div className="form-card">
        <form onSubmit={submit} className="data-form">
          <div className="input-group">
            <label>Patient</label>
            <select required value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })}>
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p.patientId} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div className="input-group"><label>Type</label><input required type="text" placeholder="e.g. Blood Test" value={form.testType} onChange={e => setForm({ ...form, testType: e.target.value })} /></div>
          <div className="input-group">
            <label>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
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
              <th>Status</th>
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
                <td>
                  <select 
                    value={t.status || 'Pending'} 
                    onChange={(e) => handleUpdate(t.testId, e.target.value)}
                    className="status-dropdown"
                    style={{
                      padding: '4px 8px', borderRadius: '4px', border: '1px solid #E2E8F0',
                      backgroundColor: t.status === 'Completed' ? '#F0FDF4' : t.status === 'In Progress' ? '#FEFCE8' : '#F8FAFC',
                      color: t.status === 'Completed' ? '#166534' : t.status === 'In Progress' ? '#854D0E' : '#475569'
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{t.date}</td>
                <td>
                  <button className="action-btn delete-btn" onClick={() => api.deleteTest(t.testId).then(reload)}>Delete</button>
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
  const [form, setForm] = useState({ patientName: '', doctorName: '', roomId: '', date: '', time: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    const res = await api.createOperation(form);
    if (res && res.status === 'error') {
      alert(res.message);
    } else {
      setForm({ patientName: '', doctorName: '', roomId: '', date: '', time: '' });
      reload();
    }
  };

  const updateStatus = async (id, newStatus) => {
    await api.updateOperationStatus(id, newStatus);
    if (newStatus === 'Completed') alert("Operation completed. Room has been freed.");
    reload();
  };

  const filteredOps = operations.filter(op =>
    op.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Surgical Operations</h1>

      <div className="form-card">
        <form onSubmit={submit} className="data-form">
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
                  <select 
                    value={op.status || 'Waiting'} 
                    onChange={(e) => updateStatus(op.operationId, e.target.value)}
                    className="status-dropdown"
                    style={{
                      padding: '4px 8px', borderRadius: '4px', border: '1px solid #E2E8F0',
                      backgroundColor: op.status === 'Completed' ? '#F0FDF4' : op.status === 'Running' ? '#FEFCE8' : '#F8FAFC',
                      color: op.status === 'Completed' ? '#166534' : op.status === 'Running' ? '#854D0E' : '#475569'
                    }}
                  >
                    <option value="Waiting">Waiting</option>
                    <option value="Running">Running</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>{op.date}</td>
                <td style={{ display: 'flex', gap: '8px' }}>
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
