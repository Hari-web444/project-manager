import React, { useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-datepicker/dist/react-datepicker.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { io } from 'socket.io-client';

import PrivateRoute from './components/auth/PrivateRoute.jsx';
import ProjectManager from './pages/project-home.jsx';
import OnboardControll from './pages/onboard-controll.jsx';

// Connect to backend Socket.IO
const socket = io('http://localhost:3001'); // Change this if backend is deployed

function App() {
  useEffect(() => {
    socket.on('project-notification', ({ message }) => {
      toast.info(message, {
        position: 'top-right',
        autoClose: 3000,
      });
    });

    return () => {
      socket.off('project-notification');
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<OnboardControll />} />
        <Route
          path="/project-management"
          element={
            <PrivateRoute>
              <ProjectManager />
            </PrivateRoute>
          }
        />
      </Routes>

      <ToastContainer />
    </>
  );
}

export default App;
