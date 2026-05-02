export const setLocalItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage', error);
  }
};

export const getLocalItem = (key) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return null;
  }
};

export const removeLocalItem = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage', error);
  }
};

export const clearAllLocal = () => {
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage', error);
  }
};

export const setSessionItem = (key, value) => {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to sessionStorage', error);
  }
};

export const getSessionItem = (key) => {
  try {
    const item = window.sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from sessionStorage', error);
    return null;
  }
};

export const removeSessionItem = (key) => {
  try {
    window.sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from sessionStorage', error);
  }
};

export const clearAllSession = () => {
  try {
    window.sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing sessionStorage', error);
  }
};
