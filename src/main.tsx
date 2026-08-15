import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { WellnessProvider } from './context/WellnessContext';
import { MusicProvider } from './context/MusicContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <WellnessProvider>
            <MusicProvider>
              <App />
            </MusicProvider>
          </WellnessProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
