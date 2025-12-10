// main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from './routes/Routes';
import { AuthContextProvider } from './context/AuthContext';
import GlobalEffects from './components/GlobalEffects';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router}>
        <GlobalEffects>
          {/* Your app renders here */}
        </GlobalEffects>
      </RouterProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)