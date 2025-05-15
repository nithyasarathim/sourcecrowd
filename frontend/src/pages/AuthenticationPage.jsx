import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Logo from '../assets/logo.png';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-green-100 flex flex-col">
      <header className="p-4">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center text-[#c1ff72] hover:text-green-300"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to home
        </button>
      </header>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-black rounded-xl border border-gray-800 shadow-lg overflow-hidden">
          {/* Logo at the top */}
          <div className="flex justify-center py-6">
            <img src={Logo} alt="Company Logo" className="h-20" />
          </div>
          
          <div className="flex border-b border-gray-800">
            <button
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                activeTab === 'login' 
                  ? 'text-[#c1ff72] border-b-2 border-[#c1ff72]' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 font-medium text-center transition-colors ${
                activeTab === 'signup' 
                  ? 'text-[#c1ff72] border-b-2 border-[#c1ff72]' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'login' ? <LoginForm logo={Logo} /> : <SignupForm logo={Logo} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({ logo }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await mockLogin(formData, logo);
      localStorage.setItem('token', response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
    
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">Email</label>
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">Password</label>
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-10 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold flex items-center justify-center ${
            loading
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-[#c1ff72] text-black hover:bg-green-300'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </>
          ) : 'Login'}
        </button>
      </div>
    </form>
  );
};

const SignupForm = ({ logo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await mockSignup(formData, logo);
      localStorage.setItem('token', response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">Full Name</label>
        <div className="relative">
          <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white"
            placeholder="John Doe"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">Email</label>
        <div className="relative">
          <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">Password</label>
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-10 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <p className="text-xs text-gray-500">Minimum 8 characters</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-300">Confirm Password</label>
        <div className="relative">
          <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-10 py-3 focus:border-[#c1ff72] focus:ring-2 focus:ring-[#c1ff72]/30 focus:outline-none text-white"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold flex items-center justify-center ${
            loading
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-[#c1ff72] text-black hover:bg-green-300'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : 'Sign Up'}
        </button>
      </div>
    </form>
  );
};

const mockLogin = async (credentials, logo) => {
  console.log('Login attempt with logo:', logo);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ token: 'mock-jwt-token', user: { id: 1, email: credentials.email } });
    }, 1000);
  });
};

const mockSignup = async (userData, logo) => {
  console.log('Signup attempt with logo:', logo);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ token: 'mock-jwt-token', user: { id: 2, email: userData.email } });
    }, 1500);
  });
};

export default AuthPage;