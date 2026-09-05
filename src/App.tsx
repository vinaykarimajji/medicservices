import { useState, useEffect } from 'react';
import { 
  Menu, Bell, Search, Calendar, ChevronRight, 
  Heart, Pill, FileText, UserPlus, Home, 
  Clock, Activity, MessageSquare, User,
  Stethoscope, Send, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { supabase } from './supabase';

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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newRegId, setNewRegId] = useState('');
  const [newName, setNewName] = useState('');
  const [newProblem, setNewProblem] = useState('');

  useEffect(() => {
    // Online/Offline listener
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
      console.error("Error fetching records. Make sure the table exists.", err);
      // Fallback mock data if table doesn't exist yet
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

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegId || !newName) return;

    const newRecord = {
      register_id: newRegId,
      name: newName,
      problem: newProblem,
      status: 'waiting' as RecordStatus,
      medicines: 'Pending Prescription'
    };

    try {
      const { data, error } = await supabase
        .from('patient_records')
        .insert([newRecord])
        .select();

      if (error) throw error;
      if (data) {
        setRecords([data[0], ...records]);
      }
    } catch (err) {
      console.error("Error inserting record", err);
      // Fallback update
      setRecords([{ ...newRecord, id: Date.now().toString(), created_at: new Date().toISOString() }, ...records]);
    }
    
    setShowAddModal(false);
    setNewRegId('');
    setNewName('');
    setNewProblem('');
  };

  const updateStatus = async (id: string, newStatus: RecordStatus) => {
    try {
      const { error } = await supabase
        .from('patient_records')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setRecords(records.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error("Error updating status", err);
      setRecords(records.map(r => r.id === id ? { ...r, status: newStatus } : r));
    }
  };

  const getStatusColor = (status: RecordStatus) => {
    switch (status) {
      case 'cured': return 'bg-green-100 text-green-700'; // Done
      case 'waiting': return 'bg-yellow-100 text-yellow-700'; // Once a week
      case 'pending': return 'bg-orange-100 text-orange-700'; // Still in hospital
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: RecordStatus) => {
    switch (status) {
      case 'cured': return 'Checked (Done)';
      case 'waiting': return 'Waiting (Weekly)';
      case 'pending': return 'Pending (Hospital)';
      default: return status;
    }
  };

  const filteredRecords = records.filter(r => 
    r.register_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50 md:bg-gray-100 overflow-hidden font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col justify-between z-10">
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <Heart className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-gray-800">HealthApp</span>
          </div>
          <nav className="px-4 py-6 space-y-2">
            <SidebarItem icon={Home} label="Home" active />
            <SidebarItem icon={Calendar} label="Appointments" />
            <SidebarItem icon={FileText} label="Records" />
            <SidebarItem icon={MessageSquare} label="Messages" />
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="text-gray-500 w-6 h-6" />
            </div>
            <span className="font-semibold text-sm">Nurse Profile</span>
          </div>
          {/* Small online/offline dot as requested */}
          <div className={`w-3 h-3 rounded-full shadow-sm ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} title={isOnline ? "Online" : "Offline"} />
        </div>
      </div>

      {/* MAIN MOBILE-APP CONTENT AREA */}
      <div className="flex-1 flex justify-center h-full relative">
        {/* Mobile App Container constraint for Desktop */}
        <div className="w-full h-full md:max-w-md bg-white md:shadow-2xl md:border-x border-gray-200 flex flex-col relative overflow-hidden">
          
          {/* MOBILE HEADER */}
          <header className="px-6 pt-12 pb-4 flex items-center justify-between bg-white sticky top-0 z-20">
            <button className="md:hidden">
              <Menu className="w-7 h-7 text-gray-700" />
            </button>
            <div className="md:hidden flex items-center gap-2 font-bold text-lg">
               HealthApp
            </div>
            <div className="flex items-center gap-4">
               {/* Small dot for connection status */}
               <div className={`md:hidden w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
               <div className="relative">
                 <Bell className="w-6 h-6 text-gray-700" />
                 <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
               </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
            
            {/* GREETING SECTION */}
            <div className="px-6 py-2 flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm mb-1">Good Morning,</p>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  Take care of <br/> your <span className="text-blue-600">health.</span>
                </h1>
              </div>
              {/* Doctor Illustration Placeholder */}
              <div className="w-20 h-24 bg-blue-50 rounded-2xl flex items-end justify-center overflow-hidden border border-blue-100">
                 <Stethoscope className="w-12 h-12 text-blue-300 mb-2" />
              </div>
            </div>

            {/* SEARCH BAR */}
            <div className="px-6 mt-6">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl flex items-center p-4">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input 
                  type="text" 
                  placeholder="Search register ID..." 
                  className="bg-transparent border-none outline-none flex-1 text-sm text-gray-700"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center">
                   <Activity className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>

            {/* BLUE BANNER */}
            <div className="px-6 mt-8">
              <div className="bg-blue-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-200">
                <div className="relative z-10 w-2/3">
                  <h2 className="text-lg font-bold mb-1">New Patient</h2>
                  <p className="text-blue-100 text-xs mb-4">Register and record new customer problems instantly.</p>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-blue-50 transition"
                  >
                    Add Record <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                {/* Decorative background shapes */}
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <FileText className="w-16 h-16 text-white/20" />
                </div>
              </div>
            </div>

            {/* SERVICES GRID */}
            <div className="px-6 mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Our Services</h3>
                <span className="text-xs text-blue-600 font-semibold cursor-pointer">View all &gt;</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <ServiceCard icon={UserPlus} label="Add Record" color="text-blue-500" bg="bg-blue-50" onClick={() => setShowAddModal(true)} />
                <ServiceCard icon={Pill} label="Medication" color="text-indigo-500" bg="bg-indigo-50" />
                <ServiceCard icon={Send} label="Send Report" color="text-purple-500" bg="bg-purple-50" />
                <ServiceCard icon={Activity} label="Status" color="text-teal-500" bg="bg-teal-50" />
              </div>
            </div>

            {/* PATIENT RECORDS LIST */}
            <div className="px-6 mt-8 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Patient Records</h3>
                <span className="text-xs text-blue-600 font-semibold cursor-pointer">View all &gt;</span>
              </div>
              
              <div className="space-y-4">
                {loading && <p className="text-center text-gray-400 text-sm">Loading records...</p>}
                
                {!loading && filteredRecords.map((record) => (
                  <div key={record.id} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3 items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="text-gray-500 w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{record.name}</h4>
                          <p className="text-xs text-gray-500">ID: {record.register_id}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(record.status)}`}>
                        {getStatusLabel(record.status)}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-2xl p-3 mb-3">
                      <p className="text-sm text-gray-700"><span className="font-semibold text-gray-500">Problem:</span> {record.problem}</p>
                      <p className="text-sm text-gray-700 mt-1"><span className="font-semibold text-gray-500">Medication:</span> {record.medicines}</p>
                    </div>

                    {/* Action buttons to change status */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateStatus(record.id, 'cured')}
                        className={`flex-1 flex justify-center items-center gap-1 py-2 rounded-xl text-xs font-bold transition ${record.status === 'cured' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-green-50'}`}
                      >
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </button>
                      <button 
                        onClick={() => updateStatus(record.id, 'waiting')}
                        className={`flex-1 flex justify-center items-center gap-1 py-2 rounded-xl text-xs font-bold transition ${record.status === 'waiting' ? 'bg-yellow-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-yellow-50'}`}
                      >
                        <Clock className="w-3 h-3" /> Waiting
                      </button>
                      <button 
                        onClick={() => updateStatus(record.id, 'pending')}
                        className={`flex-1 flex justify-center items-center gap-1 py-2 rounded-xl text-xs font-bold transition ${record.status === 'pending' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-orange-50'}`}
                      >
                        <ShieldAlert className="w-3 h-3" /> Pending
                      </button>
                    </div>
                  </div>
                ))}

                {!loading && filteredRecords.length === 0 && (
                  <p className="text-center text-gray-400 text-sm">No records found.</p>
                )}
              </div>
            </div>

            {/* HEALTH INSIGHTS CARD */}
            <div className="px-6 mb-10">
              <h3 className="font-bold text-gray-900 mb-4">Health Insights</h3>
              <div className="bg-red-50 rounded-3xl p-5 flex items-center justify-between border border-red-100">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">How to maintain a<br/>healthy heart</h4>
                  <p className="text-xs text-gray-500">5 min read</p>
                </div>
                <Heart className="w-12 h-12 text-red-400 opacity-80" />
              </div>
            </div>
            
          </main>

          {/* MOBILE BOTTOM NAVIGATION */}
          <div className="md:hidden absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-30 pb-safe">
             <NavIcon icon={Home} label="Home" active />
             <NavIcon icon={Calendar} label="Appointments" />
             <NavIcon icon={FileText} label="Records" />
             <NavIcon icon={MessageSquare} label="Messages" />
             <NavIcon icon={User} label="Profile" />
          </div>

          {/* ADD RECORD MODAL */}
          {showAddModal && (
            <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-fade-in">
                <h2 className="text-xl font-bold mb-4">New Record</h2>
                <form onSubmit={handleAddRecord} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Register ID</label>
                    <input required type="text" value={newRegId} onChange={e=>setNewRegId(e.target.value)} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500" placeholder="e.g. REG-004" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Patient Name</label>
                    <input required type="text" value={newName} onChange={e=>setNewName(e.target.value)} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500" placeholder="e.g. Anil Kumar" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Problem / Complaint</label>
                    <textarea required value={newProblem} onChange={e=>setNewProblem(e.target.value)} className="w-full bg-gray-50 p-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-500 h-24" placeholder="Describe symptoms..."></textarea>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                    <button type="submit" className="flex-1 py-3 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700">Save</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false }: any) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition ${active ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </div>
  );
}

function ServiceCard({ icon: Icon, label, color, bg, onClick }: any) {
  return (
    <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight">{label}</span>
    </div>
  );
}

function NavIcon({ icon: Icon, label, active = false }: any) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer">
      <Icon className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
      <span className={`text-[9px] font-semibold ${active ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
}
