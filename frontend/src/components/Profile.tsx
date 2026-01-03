import React from 'react';
import { User, Mail, Shield, Camera, Edit2, Save } from 'lucide-react';

interface ProfileProps {
  onBack?: () => void;
  onNavigate?: (view: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-fadeIn">
      <div className="glass-panel rounded-xl overflow-hidden relative">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-[#00f3ff]/20 via-[#bc13fe]/20 to-[#ff2a6d]/20 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <button className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 p-2 rounded-full text-white backdrop-blur-sm transition-all border border-white/10">
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        <div className="px-8 pb-8">
           {/* Avatar Area */}
          <div className="relative -mt-16 mb-6 flex justify-between items-end">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-[#0a0e17] border-4 border-[#0a0e17] flex items-center justify-center shadow-xl relative overflow-hidden group cursor-pointer">
                 <div className="w-full h-full bg-gradient-to-tr from-[#00f3ff] to-[#bc13fe] flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">JD</span>
                 </div>
                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                 </div>
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#27ae60] border-2 border-[#0a0e17] rounded-full" title="Online"></div>
            </div>
            
            <div className="flex space-x-3 mb-2">
              <button className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 font-medium transition-colors text-sm">
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#00f3ff] hover:bg-[#00f3ff]/90 text-[#0a0e17] font-bold transition-colors shadow-[0_0_15px_rgba(0,243,255,0.3)] text-sm flex items-center">
                <Save className="w-4 h-4 mr-2" /> Save Changes
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">John Doe</h1>
                <p className="text-[#00f3ff] flex items-center text-sm font-medium">
                  <Shield className="w-4 h-4 mr-1" /> Lead Data Scientist
                </p>
              </div>

              <div className="space-y-4">
                 <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                  <div className="flex items-center bg-[#0a0e17]/30 border border-white/5 rounded-lg px-4 py-3 text-gray-200">
                    <User className="w-5 h-5 text-gray-500 mr-3" />
                    John Doe
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                   <div className="flex items-center bg-[#0a0e17]/30 border border-white/5 rounded-lg px-4 py-3 text-gray-200">
                    <Mail className="w-5 h-5 text-gray-500 mr-3" />
                    john.doe@driftguard.ai
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">Account Settings</h3>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-[#bc13fe]/30 transition-colors cursor-pointer group">
                    <div>
                      <p className="font-medium text-gray-200 group-hover:text-white">Email Notifications</p>
                      <p className="text-xs text-gray-500">Receive alerts for critical drift</p>
                    </div>
                    <div className="w-10 h-5 bg-[#00f3ff]/20 rounded-full relative">
                      <div className="w-3 h-3 bg-[#00f3ff] rounded-full absolute top-1 right-1 shadow-[0_0_5px_#00f3ff]"></div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-[#bc13fe]/30 transition-colors cursor-pointer group">
                    <div>
                      <p className="font-medium text-gray-200 group-hover:text-white">Two-Factor Auth</p>
                      <p className="text-xs text-gray-500">Secure your account</p>
                    </div>
                     <div className="w-10 h-5 bg-gray-700/50 rounded-full relative">
                      <div className="w-3 h-3 bg-gray-500 rounded-full absolute top-1 left-1"></div>
                    </div>
                 </div>
              </div>

               <div className="p-4 rounded-lg bg-[#ff2a6d]/5 border border-[#ff2a6d]/20 mt-4">
                  <h4 className="text-[#ff2a6d] font-bold text-sm mb-1">Danger Zone</h4>
                  <p className="text-gray-500 text-xs mb-3">Irreversible actions for your account</p>
                  <button className="text-xs bg-[#ff2a6d]/10 hover:bg-[#ff2a6d]/20 text-[#ff2a6d] px-3 py-1.5 rounded transition-colors border border-[#ff2a6d]/30">
                    Delete Account
                  </button>
               </div>
               
               <button 
                  onClick={() => onNavigate && onNavigate('signin')}
                  className="w-full py-3 mt-4 rounded-lg bg-[#0a0e17] border border-white/10 hover:bg-white/5 text-gray-300 font-medium transition-colors flex items-center justify-center"
               >
                 Sign Out
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
