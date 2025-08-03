import React from 'react';
import './App.css';
interface CustomAlertProps {
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => (
  <div className="modal-form custom-alert">
    <div className="alert-content">
      <h2 className="form-title">Alert</h2>
      <p className="form-description">{message}</p>
      <button className="continue-button" onClick={onClose}>OK</button>
    </div>
  </div>
);
export default CustomAlert;