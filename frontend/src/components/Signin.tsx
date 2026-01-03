import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

interface SigninProps {
  onNavigate: (view: any) => void;
}

const Signin: React.FC<SigninProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // specific logic for authentication would go here
    onNavigate('dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] animate-fadeIn">
      <div className="glass-panel p-8 rounded-xl w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00f3ff] via-[#bc13fe] to-[#ff2a6d]"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-[#00f3ff]/10 rounded-full border border-[#00f3ff]/30 shadow-[0_0_20px_rgba(0,243,255,0.3)] mb-4">
            <Shield className="w-8 h-8 text-[#00f3ff]" />
          </div>
          <h2 className="text-2xl font-bold text-white text-glow">Welcome Back</h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to access DriftGuard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-[#00f3ff] transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0e17]/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#00f3ff]/50 focus:bg-[#0a0e17]/80 transition-all placeholder-gray-600"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500 group-focus-within:text-[#bc13fe] transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0e17]/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-[#bc13fe]/50 focus:bg-[#0a0e17]/80 transition-all placeholder-gray-600"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center text-gray-400 cursor-pointer">
              <input type="checkbox" className="mr-2 rounded bg-white/10 border-white/20 text-[#00f3ff] focus:ring-0" />
              Remember me
            </label>
            <a href="#" className="text-[#00f3ff] hover:text-[#00f3ff]/80 transition-colors">Forgot password?</a>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#00f3ff] to-[#0099ff] text-[#0a0e17] font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
          >
            Sign In <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('signup')} className="text-[#bc13fe] font-bold hover:text-[#bc13fe]/80 transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
