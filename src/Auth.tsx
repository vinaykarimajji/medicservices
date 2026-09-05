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
      // Fallback for hackathon demo if DB isn't setup
      if (err.message?.includes('relation "public.users" does not exist')) {
        alert('Database not setup! Logging in with a mock profile for demo purposes.');
        onLogin({ id: 'mock-1', name: name || 'Demo User', role: role, phone: phone });
      } else {
        alert(`Authentication failed: ${err.message || JSON.stringify(err)}`);
      }
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

        </div>
      </div>
    </div>
  );
}
