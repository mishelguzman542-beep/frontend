import axios from 'axios';

// CAMBIA ESTA IP POR LA DE TU COMPUTADORA
// En Windows: ipconfig -> IPv4
// En Mac/Linux: ifconfig o ip addr
const API_URL = 'http://192.168.1.3:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== FUNCIONES DE AUTENTICACIÓN ==========
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// ========== FUNCIONES DE PACIENTES ==========
export const getPatients = async () => {
  try {
    const response = await api.get('/');  // ✅ CORRECTO: / 
    return response.data;
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    throw error;
  }
};

export const createPatient = async (patientData) => {
  try {
    const response = await api.post('/', patientData);  // ✅ CORRECTO: /
    return response.data;
  } catch (error) {
    console.error('Error creando paciente:', error);
    throw error;
  }
};

export const updatePatient = async (id, patientData) => {
  try {
    const response = await api.put(`/${id}`, patientData);  // ✅ CORRECTO: /${id}
    return response.data;
  } catch (error) {
    console.error('Error actualizando paciente:', error);
    throw error;
  }
};

export const deletePatient = async (id) => {
  try {
    const response = await api.delete(`/${id}`);  // ✅ CORRECTO: /${id}
    return response.data;
  } catch (error) {
    console.error('Error eliminando paciente:', error);
    throw error;
  }
};

export default api;