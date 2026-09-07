import { useState } from 'react';
import { supabase } from './supabase';
import { Heart, Phone, ArrowRight, ShieldCheck, User } from 'lucide-react';

export default function Auth({ onLogin }: { onLogin: (user: any) => void }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  
  // Registration state
  const [name, setName] = useState('');
  const [role, setRole] = useState('patient');
  
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return alert('Enter a valid 10-digit phone number');
    
    setLoading(true);
    try {
      // For MVP: Check if user exists in our custom users table
      const { data, error } = await supabase.from('users').select('*').eq('phone', phone).single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 means no rows returned
      
      if (!data) {
        setIsNewUser(true);
      }
      
      // Simulate SMS delay
      setTimeout(() => {
        setStep(2);
        setLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '1234') return alert('For this demo, please use OTP: 1234');
    
    setLoading(true);
    try {
      if (isNewUser) {
        if (!name) return alert('Please enter your name');
        
        const { data, error } = await supabase.from('users').insert([{
          phone,
          name,
          role,
          preferred_language: 'mr'
        }]).select().single();
        
        if (error) throw error;
        onLogin(data);
      } else {
        const { data, error } = await supabase.from('users').select('*').eq('phone', phone).single();
        if (error) throw error;
        onLogin(data);
      }
    } catch (err: any) {
      console.error('Auth Error Details:', err);
      // Fallback for hackathon demo if DB isn't fully setup or RLS violates
      alert('Demo Mode: Logging in with a mock profile (Database/RLS bypassed).');
      onLogin({ id: 'VHH-9842-X7', name: name || (role === 'asha' ? 'Nurse Anita' : 'Ramesh Patil'), role: role, phone: phone });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mesh-bg min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-2xl border border-white/60 relative overflow-hidden">
        
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-white/50 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white/60 mx-auto">
            <Heart className="text-teal-600 w-8 h-8" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2 tracking-tight">ArogyaLink</h1>
          <p className="text-center text-gray-600 mb-8 font-medium">Rural Health Connected.</p>

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
                <div className="flex bg-white/60 border border-white/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 shadow-inner">
                  <div className="bg-gray-100/50 px-4 flex items-center justify-center text-gray-500 font-bold border-r border-white/50">
                    +91
                  </div>
                  <input 
                    type="tel" 
                    placeholder="Enter your 10-digit number" 
                    className="flex-1 bg-transparent p-3 outline-none text-gray-900 font-medium"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={10}
                  />
                  <div className="px-4 flex items-center justify-center text-gray-400">
                    <Phone className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={loading || phone.length < 10}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-teal-600/30 transition flex items-center justify-center gap-2"
              >
                {loading ? 'Sending OTP...' : 'Get OTP'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-teal-50/50 border border-teal-600/20 rounded-xl p-3 mb-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
                <p className="text-xs text-teal-800 font-medium">OTP sent to +91 {phone}. For this demo, use <strong className="font-bold text-teal-900 text-sm">1234</strong></p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Enter OTP</label>
                <input 
                  type="text" 
                  placeholder="1234" 
                  className="w-full bg-white/60 border border-white/50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-center tracking-widest text-xl font-bold shadow-inner"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                />
              </div>

              {isNewUser && (
                <div className="space-y-4 pt-2 border-t border-white/40">
                  <p className="text-sm font-bold text-gray-900">Complete Profile</p>
                  <div className="flex bg-white/60 border border-white/50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 shadow-inner">
                    <div className="px-3 flex items-center justify-center text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="flex-1 bg-transparent p-3 outline-none text-gray-900 font-medium pl-0"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition ${role === 'patient' ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white/50 border-white/50 text-gray-700 hover:bg-white'}`}>
                      <input type="radio" name="role" value="patient" className="sr-only" checked={role === 'patient'} onChange={() => setRole('patient')} />
                      <span className="font-bold text-sm">Patient</span>
                    </label>
                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition ${role === 'asha' ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white/50 border-white/50 text-gray-700 hover:bg-white'}`}>
                      <input type="radio" name="role" value="asha" className="sr-only" checked={role === 'asha'} onChange={() => setRole('asha')} />
                      <span className="font-bold text-sm">ASHA/Nurse</span>
                    </label>
                  </div>
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading || otp.length !== 4}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-teal-600/30 transition flex items-center justify-center gap-2 mt-4"
              >
                {loading ? 'Verifying...' : 'Login Securely'}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-white/40">
             <div className="relative flex items-center justify-center mb-6">
                <span className="bg-white/30 text-gray-500 font-bold text-xs px-2 rounded backdrop-blur-sm z-10 absolute">OR CONTINUE WITH</span>
                <div className="w-full h-[1px] bg-white/40"></div>
             </div>
             
             <button 
               onClick={async () => {
                 try {
                   const { error } = await supabase.auth.signInWithOAuth({
                     provider: 'google',
                     options: {
                       redirectTo: window.location.origin,
                     }
                   });
                   if (error) throw error;
                 } catch (err) {
                   console.error("Google Sign-In Error:", err);
                   alert("Please follow the instructions in the artifact to fully enable Google Sign-In in Supabase.");
                 }
               }}
               className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold py-3.5 px-6 rounded-xl shadow-sm border border-gray-200 transition flex items-center justify-center gap-3"
             >
               <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>
               Sign in with Google
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}
