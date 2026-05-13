import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
<<<<<<< HEAD
import { CmsProvider } from './context/CmsContext'
=======
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <HashRouter>
        <AuthProvider>
          <DataProvider>
<<<<<<< HEAD
            <CmsProvider>
              <App />
            </CmsProvider>
=======
            <App />
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
          </DataProvider>
        </AuthProvider>
      </HashRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
