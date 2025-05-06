import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import "@fontsource/montserrat"; 
import "@fontsource/montserrat/500.css"; 
import "@fontsource/montserrat/600.css"; 
import "@fontsource/montserrat/700.css"; 
import "@fontsource/montserrat/800.css"; 
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
