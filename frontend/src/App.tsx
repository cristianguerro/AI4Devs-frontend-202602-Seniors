import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AddCandidateForm from './components/AddCandidateForm';
import PositionProcessDetail from './components/PositionProcessDetail';
import Positions from './components/Positions';
import RecruiterDashboard from './components/RecruiterDashboard';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RecruiterDashboard />} />
        <Route path="/add-candidate" element={<AddCandidateForm />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/positions/:positionId/process" element={<PositionProcessDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
