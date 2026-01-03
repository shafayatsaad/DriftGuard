import React, { useState } from 'react';
import { Shield, User, Mail, Lock, ArrowRight } from 'lucide-react';

interface SignupProps {
  onNavigate: (view: any) => void;
}

const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for registration
    onNavigate('dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] animate-fadeIn">
       <div className="glass-panel p-8 rounded-xl w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#bc13fe] via-[#ff2a6d] to-[#f39c12]"></div>

        <div className="flex flex-col items-center mb-8">
           <div className="p-3 bg-[#bc13fe]/10 rounded-full border border-[#bc13fe]/30 shadow-[0_0_20px_rgba(188,19,254,0.3)] mb-4">
            <Shield className="w-8 h-8 text-[#bc13fe]" />
          </div>
          <h2 className="text-2xl font-bold text-white text-glow">Create Account</h2>
          <p className="text-gray-400 text-sm mt-1">Join DriftGuard today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
           <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-[#bc13fe] transition-colors" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0a0e17]/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#bc13fe]/50 focus:bg-[#0a0e17]/80 transition-all placeholder-gray-600"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Email Address</label>
             <div className="relative group">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-[#bc13fe] transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0e17]/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#bc13fe]/50 focus:bg-[#0a0e17]/80 transition-all placeholder-gray-600"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-[#ff2a6d] transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0e17]/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#ff2a6d]/50 focus:bg-[#0a0e17]/80 transition-all placeholder-gray-600"
                placeholder="Create a strong password"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#bc13fe] to-[#ff2a6d] text-white font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(188,19,254,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center mt-2"
          >
            Create Account <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
           <button onClick={() => onNavigate('signin')} className="text-[#00f3ff] font-bold hover:text-[#00f3ff]/80 transition-colors">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
