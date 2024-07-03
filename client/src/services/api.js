const API_URL = 'http://localhost:3000/api'; // Replace with your actual API URL

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  const data = await response.json();
  return data.token;
};

export const signup = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Signup failed');
};

export const getLinks = async () => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/links`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch links');
  return response.json();
};

export const saveLink = async (text, url) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ text, url }),
  });
  if (!response.ok) throw new Error('Failed to save link');
};

export const logout = () => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.remove('token');
  } else {
    localStorage.removeItem('token');
  }
};

const getToken = () => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['token'], (result) => {
        resolve(result.token);
      });
    } else {
      resolve(localStorage.getItem('token'));
    }
  });
};