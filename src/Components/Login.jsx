import { Button, Col, Input, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { signinUser } from '../config/authCall';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login({ mail }) {
  const { user } = useAuth();
  const [userName, setUserName] = useState(mail);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/Todolist');
  }, [user]);

  const changeName = (inputvalue) => {
    setUserName(inputvalue.target.value);
  };
  const changePassword = (inputvalue) => {
    setPassword(inputvalue.target.value);
  };
  const login = () => {
    signinUser(userName, password);
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Hola, user</h1>
        
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Input
              size='small'
              placeholder='Correo del usuario'
              value={userName}
              onChange={changeName}
            />
          </Col>
        </Row>
        
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Input.Password
              size='small'
              placeholder='Contraseña'
              value={password}
              onChange={changePassword}
            />
          </Col>
        </Row>
  
        <Button onClick={login} className="login-button">Login</Button>
       
      </div>
    </div>
  );
}
