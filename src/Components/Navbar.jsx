import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogoutOutlined } from '@ant-design/icons';
import { readDataFirestore } from '../config/firestoreCalls';


export default function Navbar() {
  const { logout, user } = useAuth();
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    readUser();
  }, [user]);

  const readUser = async () => {
    const luser2 = await readDataFirestore('users', 'email', user.email);
    if (!luser2.empty) {
      setLocalUser(luser2.docs[0].data());
    }
  };

  return (
    <div className='Navbar'>
      <div className="welcome-message">Hola, {user && user.email}</div>
      <LogoutOutlined className="logout-icon" onClick={logout} /> 
    </div>
  );
}
