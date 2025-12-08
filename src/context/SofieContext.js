import React, { createContext, useCallback, useState } from 'react';

export const SofieContext = createContext();

export const SofieProvider = ({ children }) => {
  const [state, setState] = useState({});
  const [errors, setErrors] = useState([]);

  const updateState = useCallback((key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }, []);

  const clearState = useCallback((key) => {
    setState((prevState) => {
      const newState = { ...prevState };
      delete newState[key];
      return newState;
    });
  }, []);

  const addError = useCallback((error) => {
    const errorObj = {
      id: Date.now(),
      message: error.message || error,
      timestamp: new Date(),
    };
    setErrors((prev) => [...prev, errorObj]);
    return errorObj.id;
  }, []);

  const removeError = useCallback((errorId) => {
    setErrors((prev) => prev.filter((e) => e.id !== errorId));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const value = {
    state,
    updateState,
    clearState,
    errors,
    addError,
    removeError,
    clearErrors,
  };

  return <SofieContext.Provider value={value}>{children}</SofieContext.Provider>;
};
