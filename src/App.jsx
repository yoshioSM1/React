import './App.css';
import Login from './Components/Login';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Todolist from './Components/Todolist'; 

import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './Components/ProtectedRoute';

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Navigate to="/login" replace />} />
            <Route path='/login' element={<Login mail={'yoshio.soto@softtek.com'} />} />
            <Route
              path='/navbar'
              element={
                <ProtectedRoute>
                  <Navbar />
                </ProtectedRoute>
              }
            />
            <Route
              path='/Todolist'
              element={
                <ProtectedRoute>
                  <Todolist />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

