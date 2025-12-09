import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import { router } from './routes/Routes';
import { AuthContextProvider } from './context/AuthContext'; // <--- 1. Import this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Wrap the Provider around your app */}
    <AuthContextProvider> 
      <div className="max-w-screen mx-auto">
          <RouterProvider router={router} />
      </div>
    </AuthContextProvider>
  </React.StrictMode>,
)