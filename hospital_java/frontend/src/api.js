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

export const fetchBeds = async () => {
    const res = await fetch(`${API_BASE}/rooms/beds`);
    return res.json();
};

export const fetchOTRooms = async () => {
    const res = await fetch(`${API_BASE}/rooms/ot`);
    return res.json();
};

export const createRoom = async (roomId, roomType) => {
    const res = await fetch(`${API_BASE}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, roomType }),
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

// --- BILLING ---
export const fetchBills = async () => {
    const res = await fetch(`${API_BASE}/billing`);
    return res.json();
};

export const createBill = async (bill) => {
    const res = await fetch(`${API_BASE}/billing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bill),
    });
    return res.json();
};

export const deleteBill = async (id) => {
    const res = await fetch(`${API_BASE}/billing?id=${id}`, {
        method: 'DELETE',
    });
    return res.json();
};

// --- PHARMACY (MEDICINES) ---
export const fetchMedicines = async () => {
    const res = await fetch(`${API_BASE}/pharmacy`);
    return res.json();
};

export const createMedicine = async (medicine) => {
    const res = await fetch(`${API_BASE}/pharmacy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicine),
    });
    return res.json();
};

export const updateMedicine = async (medicineId, stock, price) => {
    const res = await fetch(`${API_BASE}/pharmacy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineId, stock, price }),
    });
    return res.json();
};

export const deleteMedicine = async (id) => {
    const res = await fetch(`${API_BASE}/pharmacy?id=${id}`, {
        method: 'DELETE',
    });
    return res.json();
};

// --- LAB (TESTS) ---
export const fetchTests = async () => {
    const res = await fetch(`${API_BASE}/lab`);
    return res.json();
};

export const createTest = async (test) => {
    const res = await fetch(`${API_BASE}/lab`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test),
    });
    return res.json();
};

export const updateTest = async (testId, result) => {
    const res = await fetch(`${API_BASE}/lab`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId, result }),
    });
    return res.json();
};

export const deleteTest = async (id) => {
    const res = await fetch(`${API_BASE}/lab?id=${id}`, {
        method: 'DELETE',
    });
    return res.json();
};


// --- OPERATIONS ---
export const fetchOperations = async () => {
    const res = await fetch(`${API_BASE}/operations`);
    return res.json();
};

export const createOperation = async (operation) => {
    const res = await fetch(`${API_BASE}/operations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operation),
    });
    return res.json();
};

export const updateOperationStatus = async (operationId, status) => {
    const res = await fetch(`${API_BASE}/operations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationId, status }),
    });
    return res.json();
};

export const deleteOperation = async (id) => {
    const res = await fetch(`${API_BASE}/operations?id=${id}`, {
        method: 'DELETE',
    });
    return res.json();
};

