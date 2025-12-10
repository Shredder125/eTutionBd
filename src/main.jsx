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
      <GlobalEffects>
        <div className="max-w-screen mx-auto">
            <RouterProvider router={router} />
        </div>
      </GlobalEffects>
    </AuthContextProvider>
  </React.StrictMode>,
)