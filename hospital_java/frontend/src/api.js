const API_BASE = 'http://localhost:8080/api';

export const fetchPatients = async () => {
    const res = await fetch(`${API_BASE}/patients`);
    return res.json();
};

export const createPatient = async (patient) => {
    const res = await fetch(`${API_BASE}/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
    });
    return res.json();
};

export const updatePatient = async (patientId, disease) => {
    const res = await fetch(`${API_BASE}/patients`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, disease }),
    });
    return res.json();
};

export const deletePatient = async (id) => {
    const res = await fetch(`${API_BASE}/patients?id=${id}`, {
        method: 'DELETE',
    });
    return res.json();
};


export const fetchDoctors = async () => {
    const res = await fetch(`${API_BASE}/doctors`);
    return res.json();
};

export const createDoctor = async (doctor) => {
    const res = await fetch(`${API_BASE}/doctors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doctor),
    });
    return res.json();
};

export const deleteDoctor = async (id) => {
    const res = await fetch(`${API_BASE}/doctors?id=${id}`, {
        method: 'DELETE',
    });
    return res.json();
};


export const fetchAppointments = async () => {
    const res = await fetch(`${API_BASE}/appointments`);
    return res.json();
};

export const createAppointment = async (appointment) => {
    const res = await fetch(`${API_BASE}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment),
    });
    return res.json();
};

export const deleteAppointment = async (id) => {
    const res = await fetch(`${API_BASE}/appointments?id=${id}`, {
        method: 'DELETE',
    });
    return res.json();
};

export const fetchRooms = async () => {
    const res = await fetch(`${API_BASE}/rooms`);
    return res.json();
};

export const createRoom = async (roomId) => {
    const res = await fetch(`${API_BASE}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId }),
    });
    return res.json();
};

export const assignRoom = async (id, patientName) => {
    const res = await fetch(`${API_BASE}/rooms`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: id, action: 'assign', patientName }),
    });
    return res.json();
};

export const freeRoom = async (id) => {
    const res = await fetch(`${API_BASE}/rooms`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: id, action: 'free' }),
    });
    return res.json();
};

export const admitPatient = async (patientName) => {
    const res = await fetch(`${API_BASE}/rooms`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'admit', patientName }),
    });
    return res.json();
};

export const dischargePatient = async (patientName) => {
    const res = await fetch(`${API_BASE}/rooms`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'discharge', patientName }),
    });
    return res.json();
};

// --- Medical Records ---
export const fetchRecords = async () => {
    const res = await fetch(`${API_BASE}/records`);
    return res.json();
};

export const createRecord = async (record) => {
    const res = await fetch(`${API_BASE}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
    });
    return res.json();
};

export const updateRecord = async (id, diagnosis, treatment) => {
    const res = await fetch(`${API_BASE}/records`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId: id, diagnosis, treatment }),
    });
    return res.json();
};

export const deleteRecord = async (id) => {
    const res = await fetch(`${API_BASE}/records?id=${id}`, {
        method: 'DELETE',
    });
    return res.json();
};
