import React, { useState } from 'react';
import Login from './Login';
import SignUp from './Signup';

const Auth = ({ onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState('login');

  const switchAuthMode = (mode) => {
    setAuthMode(mode || (authMode === 'login' ? 'signup' : 'login'));
  };

  return (
    <div className="auth-wrapper">
      {authMode === 'login' ? (
        <Login 
          onLoginSuccess={onAuthSuccess} 
          onSwitchMode={() => switchAuthMode('signup')} 
        />
      ) : (
        <SignUp 
          onSignUpSuccess={onAuthSuccess} 
          onSwitchMode={() => switchAuthMode('login')} 
        />
      )}
    </div>
  );
};

export default Auth;