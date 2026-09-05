import { useState, useEffect } from 'react';
import { 
  Search, Calendar, Heart, Pill, FileText, UserPlus, Home, 
  Activity, MessageSquare, User, Wifi, WifiOff,
  Stethoscope, Send, Languages, AlertCircle, Video
} from 'lucide-react';
import { supabase } from './supabase';

type Lang = 'EN' | 'MR' | 'HI';
type RecordStatus = 'cured' | 'waiting' | 'pending';

interface PatientRecord {
  id: string;
  register_id: string;
  name: string;
  problem: string;
  medicines: string;
  status: RecordStatus;
  created_at: string;
}

export default function App() {
  const [lang, setLang] = useState<Lang>('EN');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [activePathway, setActivePathway] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    fetchRecords();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patient_records')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setRecords(data);
    } catch (err) {
      console.error("Error fetching records", err);
      // Fallback
      if (records.length === 0) {
        setRecords([
          { id: '1', register_id: 'REG-101', name: 'Ramesh Patil', problem: 'High Fever', medicines: 'Paracetamol', status: 'waiting', created_at: new Date().toISOString() },
          { id: '2', register_id: 'REG-102', name: 'Sita Devi', problem: 'Severe Headaches', medicines: 'Aspirin', status: 'cured', created_at: new Date().toISOString() },
          { id: '3', register_id: 'REG-103', name: 'Raju Sharma', problem: 'Snake Bite', medicines: 'Antivenom', status: 'pending', created_at: new Date().toISOString() }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: RecordStatus) => {
    switch (status) {
      case 'cured': return 'bg-green-500 text-white shadow-green-500/30';
      case 'waiting': return 'bg-yellow-500 text-white shadow-yellow-500/30';
      case 'pending': return 'bg-orange-500 text-white shadow-orange-500/30';
      default: return 'bg-gray-500 text-white';
    }
  };

  const filteredRecords = records.filter(r => 
    r.register_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mesh-bg min-h-screen text-gray-800 font-sans flex flex-col md:flex-row overflow-hidden relative">
      
      {/* DESKTOP SIDEBAR - GLASSMORPHISM */}
      <aside className="hidden md:flex w-64 glass-panel m-4 mr-0 rounded-3xl flex-col justify-between z-20 shadow-2xl">
        <div>
          <div className="p-6 pb-4 flex flex-col items-center border-b border-white/20">
            <div className="w-12 h-12 bg-white/50 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-white/60">
              <Heart className="text-teal-600 w-6 h-6" />
            </div>
            <h1 className="font-bold text-lg text-center text-gray-900">Village Health Helper</h1>
            <p className="text-[10px] text-gray-600 font-medium tracking-wide">Gramin Arogya Sahayak</p>
          </div>
          <nav className="p-3 space-y-1 mt-2">
            <SidebarItem icon={Home} label="Dashboard" active />
            <SidebarItem icon={Calendar} label="Appointments" />
            <SidebarItem icon={FileText} label="Patient Records" />
            <SidebarItem icon={MessageSquare} label="Consultations" />
          </nav>
        </div>
        <div className="p-4 border-t border-white/20">
          <div className="glass-panel p-3 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center border border-white">
              <User className="text-teal-700 w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">ASHA Worker</p>
              <p className="text-xs text-gray-600">ID: MH-1452</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV - GLASSMORPHISM */}
      <nav className="md:hidden fixed bottom-0 w-full glass-panel z-50 flex justify-around p-4 rounded-t-3xl border-t border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-safe">
         <NavIcon icon={Home} label="Home" active />
         <NavIcon icon={FileText} label="Records" />
         <NavIcon icon={Video} label="Consult" />
         <NavIcon icon={User} label="Profile" />
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto p-4 md:p-6 z-10 scroll-smooth pb-28 md:pb-6 relative">
        
        {/* TOP HEADER */}
        <header className="glass-panel rounded-2xl p-3 md:px-6 flex justify-between items-center mb-4 shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {/* Mobile Title */}
              <div className="md:hidden flex items-center gap-1 font-bold text-gray-900 text-sm">
                 <Heart className="text-teal-600 w-4 h-4" />
                 VHH
              </div>

              {/* Dynamic Connection Indicator */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[10px] md:text-xs border ${
                  isOnline ? 'bg-green-500/20 text-green-800 border-green-500/30' : 'bg-red-500/20 text-red-800 border-red-500/30'
                }`}
              >
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white/30 p-1 rounded-full border border-white/40">
              {(['EN', 'MR', 'HI'] as Lang[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold transition-all ${
                    lang === l ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {l}
                </button>
              ))}
              <Languages className="w-3 h-3 text-gray-500 ml-1 mr-2 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* HERO SECTION: PATIENT LOOKUP */}
        <section className="glass-panel rounded-3xl p-5 md:p-8 mb-4 flex flex-col items-center justify-center text-center shadow-md">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Who are we treating today?
          </h2>
          <p className="text-gray-600 mb-4 max-w-md font-medium text-sm">
            Search existing patients via Registration ID / ABHA ID to view records, or add a new patient instantly.
          </p>
          
          <div className="w-full max-w-xl flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white/50 rounded-xl flex items-center p-1.5 shadow-inner">
              <Search className="w-5 h-5 text-teal-600 ml-3 mr-2" />
              <input 
                type="text" 
                placeholder="Enter ABHA ID or Name..." 
                className="bg-transparent border-none outline-none flex-1 text-base text-gray-800 p-1 placeholder-gray-500"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 text-sm rounded-xl shadow-lg shadow-teal-600/30 transition-transform active:scale-95 whitespace-nowrap">
              Search Record
            </button>
          </div>
        </section>

        {/* 3 PRIMARY ACTION CARDS (GRID) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 relative z-10">
          
          {/* Card 1: Find Medicine */}
          <button onClick={() => setActivePathway('medicine')} className="glass-panel rounded-2xl p-5 md:p-6 text-left transition-all hover:scale-[1.02] hover:bg-white/50 group cursor-pointer border border-white/60">
            <div className="w-12 h-12 bg-blue-500/20 text-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
              <Pill className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Find My Medicine</h3>
            <p className="text-gray-600 font-medium text-xs">Locate nearby inventory and check real-time stock at PHCs/Sub-Centres.</p>
          </button>

          {/* Card 2: Smart Guide */}
          <button onClick={() => setActivePathway('triage')} className="glass-panel rounded-2xl p-5 md:p-6 text-left transition-all hover:scale-[1.02] hover:bg-white/50 group cursor-pointer border border-white/60">
            <div className="w-12 h-12 bg-purple-500/20 text-purple-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Smart Guide & Video</h3>
            <p className="text-gray-600 font-medium text-xs">Triage symptoms & connect with city specialists via teleconsultation.</p>
          </button>

          {/* Card 3: RED SOS */}
          <button onClick={() => setActivePathway('sos')} className="glass-panel-red rounded-2xl p-5 md:p-6 text-left transition-all hover:scale-[1.02] group cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="w-12 h-12 bg-red-500/30 text-red-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500/40 transition-colors border border-red-500/20">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-red-900 mb-1">Red SOS Button</h3>
            <p className="text-red-800/80 font-medium text-xs">Trigger 108 emergency escalation for critical cases & reserve beds.</p>
          </button>

        </section>

        {/* SUPABASE RECORDS LIST */}
        <section className="glass-panel rounded-2xl p-5 md:p-6 relative z-10 shadow-lg">
          <div className="flex justify-between items-center mb-4 border-b border-white/30 pb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Patient Records</h3>
              <p className="text-[10px] text-gray-600">Synced via Supabase</p>
            </div>
            <button className="bg-white/50 hover:bg-white/80 border border-white/60 text-gray-800 font-bold py-1.5 px-3 rounded-lg transition text-xs flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5" /> Add Record
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <p className="text-gray-500 text-sm font-medium col-span-full">Loading records from database...</p>
            ) : filteredRecords.length === 0 ? (
              <p className="text-gray-500 text-sm font-medium col-span-full">No records found.</p>
            ) : (
              filteredRecords.map((record) => (
                <div key={record.id} className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-4 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900 text-base leading-tight">{record.name}</h4>
                      <p className="text-[10px] font-semibold text-teal-700 bg-teal-500/10 px-2 py-0.5 rounded inline-block mt-1">ID: {record.register_id}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold shadow-sm ${getStatusColor(record.status)}`}>
                      {record.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <p className="text-xs text-gray-800"><span className="text-gray-500 font-medium">Problem:</span> {record.problem}</p>
                    <p className="text-xs text-gray-800"><span className="text-gray-500 font-medium">Meds:</span> {record.medicines}</p>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-white/40">
                    <button className="flex-1 bg-white/50 hover:bg-white border border-white/50 text-gray-700 font-bold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 transition">
                      <Send className="w-3 h-3" /> Report
                    </button>
                    <button className="flex-1 bg-white/50 hover:bg-white border border-white/50 text-gray-700 font-bold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 transition">
                      <Activity className="w-3 h-3" /> Status
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>

      {/* QUICK MODALS FOR PATHWAYS (Preview) */}
      {activePathway && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setActivePathway(null)}>
          <div className="glass-panel bg-white/70 w-full max-w-2xl rounded-3xl p-8 shadow-2xl border border-white" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {activePathway === 'medicine' ? 'Find Medicine' : activePathway === 'triage' ? 'Smart Guide' : 'Emergency SOS'}
              </h2>
              <button onClick={() => setActivePathway(null)} className="w-8 h-8 bg-gray-200/50 rounded-full flex items-center justify-center font-bold hover:bg-gray-300/50">×</button>
            </div>
            
            {activePathway === 'sos' ? (
              <div className="text-center py-8">
                 <div className="w-24 h-24 bg-red-500/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                   <AlertCircle className="w-12 h-12" />
                 </div>
                 <h3 className="text-3xl font-extrabold text-red-600 mb-2">TRIGGER 108 ESCALATION</h3>
                 <p className="text-gray-600 mb-6">Dispatch ambulance and reserve emergency bed at nearest District Hospital.</p>
                 <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl shadow-red-600/30 text-xl">CONFIRM SOS</button>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-600 font-medium">
                <p>Feature view opened: <strong>{activePathway}</strong>.</p>
                <p className="text-sm mt-2">Integrating full functionality from earlier iteration inside the new Glassmorphic modal...</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all ${active ? 'bg-teal-600/10 text-teal-800 font-bold border border-teal-600/20' : 'text-gray-600 hover:bg-white/40 hover:text-gray-900 font-medium'}`}>
      <Icon className={`w-5 h-5 ${active ? 'text-teal-700' : ''}`} />
      <span>{label}</span>
    </div>
  );
}

function NavIcon({ icon: Icon, label, active = false }: any) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer">
      <div className={`p-2 rounded-xl ${active ? 'bg-teal-600/20' : ''}`}>
         <Icon className={`w-6 h-6 ${active ? 'text-teal-700' : 'text-gray-500'}`} />
      </div>
      <span className={`text-[10px] font-bold ${active ? 'text-teal-800' : 'text-gray-500'}`}>{label}</span>
    </div>
  );
}
