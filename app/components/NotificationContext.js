import React, { createContext, useContext, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const showSuccess = useCallback((message) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message) => {
    toast.error(message);
  }, []);

  const showInfo = useCallback((message) => {
    toast.info(message);
  }, []);

  const showWarning = useCallback((message) => {
    toast.warn(message);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ showSuccess, showError, showInfo, showWarning }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
