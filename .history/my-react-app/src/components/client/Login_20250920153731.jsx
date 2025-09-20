// src/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/client/Login.css'
import logo from '../../assets/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:8085/cms/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login response:', data);

      // Store only required values in localStorage
      localStorage.setItem('id', data.id);
      localStorage.setItem('role', data.role);
      localStorage.setItem('jwtToken', data.jwtToken);
      localStorage.setItem('email', data.email);

      if (data.role === 'warehouse_keeper') {
        navigate('/wmhome');
      } else if (data.role === 'deliveryman') {
        navigate('/dphome');
      } else {
        navigate('/home'); // Default redirection
      }
      setPassword('');
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid email or password');
    }
  };

  return (
    <div className="login-container bg-white p-8 rounded-lg shadow-md w-100 mx-auto mt-40  my-auto">
      <img src={logo} alt="Logo" className="w-50 h-50 mx-auto" />
      <h2 className='text-2xl font-bold mb-6 text-blue-600'>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className='bg-red-100'>Login</button>
        <p className='text-gray-800 mt-3 text-sm text-center'>Don't Have An Account ? <a href="/register" className='text-blue-500 underline'>Register</a></p>
      </form>
    </div>
  );
}

export default Login;