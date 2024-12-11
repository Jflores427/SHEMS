import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthOptions, AuthProvider } from './authentication/AuthOptions.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <App />
    </AuthProvider>
)
