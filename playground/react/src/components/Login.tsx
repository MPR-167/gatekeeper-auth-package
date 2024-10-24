import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {login} = useAuth();

  const handleLogin = async () => {
    login(email, password);
    console.log("Login successful");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-white">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
      {/* 
        {showOTP && <OTP email={email} />} */}
      </div>
    </div>
  );
};
