import { useState, useEffect } from 'react';
import { 
  Search, Calendar, Heart, Pill, FileText, UserPlus, Home, 
  MessageSquare, User, Wifi, WifiOff,
  Stethoscope, Languages, AlertCircle, Video, ShoppingBag, CheckCircle
} from 'lucide-react';
import { supabase } from './supabase';

type Lang = 'EN' | 'MR' | 'HI';
type Role = 'nurse' | 'patient';
type RecordStatus = 'pending' | 'prescribed' | 'ordered' | 'cured';

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
  const [currentUser, setCurrentUser] = useState<any>({
    id: 'mock-1',
    name: 'Ramesh Patil',
    role: 'patient',
    phone: '1234567890'
  });
  const [lang, setLang] = useState<Lang>('EN');
  
  // Derive role directly from currentUser instead of independent state
  const role: Role = currentUser?.role === 'asha' ? 'nurse' : 'patient';
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [activePathway, setActivePathway] = useState<string | null>(null);
  const [prescribeModal, setPrescribeModal] = useState<PatientRecord | null>(null);
  const [newMeds, setNewMeds] = useState('');

  // Patient Form State
  const [patientName, setPatientName] = useState('');
  const [patientProblem, setPatientProblem] = useState('');
  const [patientReqMeds, setPatientReqMeds] = useState('');

  // New States for interactive mock features
  const [bookedHospitals, setBookedHospitals] = useState<number[]>([]);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [vitals, setVitals] = useState({ bp: '120/80', sugar: '95' });
  const [bookingModal, setBookingModal] = useState<{ index: number, name: string } | null>(null);
  const [bookingDetails, setBookingDetails] = useState({ name: currentUser?.name || '', reason: '', date: new Date().toISOString().split('T')[0], time: 'Morning' });
  const [medSearchQuery, setMedSearchQuery] = useState('');
  const [deliveryModal, setDeliveryModal] = useState<any>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Order Confirmed! ${deliveryModal.medName} will be delivered from ${deliveryModal.pharmacy} to your address: ${deliveryAddress}.`);
    setDeliveryModal(null);
  };

  const handleBookSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingModal !== null && !bookedHospitals.includes(bookingModal.index)) {
      setBookedHospitals([...bookedHospitals, bookingModal.index]);
      alert(`Appointment Booked for ${bookingDetails.name} at ${bookingModal.name} on ${bookingDetails.date} (${bookingDetails.time}). You will receive an SMS reminder shortly.`);
      setBookingModal(null);
    }
  };

  const handleLogVitals = (type: 'bp' | 'sugar') => {
    const newVal = prompt(`Enter new ${type === 'bp' ? 'Blood Pressure' : 'Blood Sugar'}:`);
    if (newVal) {
      setVitals(prev => ({ ...prev, [type]: newVal }));
      alert(`${type === 'bp' ? 'Blood Pressure' : 'Blood Sugar'} updated successfully in your Patient Record!`);
    }
  };

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
          { id: '1', register_id: 'REG-101', name: 'Ramesh Patil', problem: 'High Fever', medicines: 'Pending Review', status: 'pending', created_at: new Date().toISOString() },
          { id: '2', register_id: 'REG-102', name: 'Sita Devi', problem: 'Severe Headaches', medicines: 'Aspirin 500mg', status: 'prescribed', created_at: new Date().toISOString() },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientProblem) return;

    const newRecord = {
      register_id: `PAT-${Math.floor(Math.random() * 10000)}`,
      name: patientName,
      problem: patientProblem,
      medicines: patientReqMeds ? `Requested: ${patientReqMeds}` : 'Pending Review',
      status: 'pending' as RecordStatus,
    };

    try {
      const { data, error } = await supabase.from('patient_records').insert([newRecord]).select();
      if (error) throw error;
      if (data) setRecords([data[0], ...records]);
    } catch (err) {
      setRecords([{ ...newRecord, id: Date.now().toString(), created_at: new Date().toISOString() }, ...records]);
    }
    
    setPatientName(''); setPatientProblem(''); setPatientReqMeds('');
    alert("Record submitted successfully!");
  };

  const updateRecord = async (id: string, updates: Partial<PatientRecord>) => {
    try {
      const { error } = await supabase.from('patient_records').update(updates).eq('id', id);
      if (error) throw error;
      setRecords(records.map(r => r.id === id ? { ...r, ...updates } : r));
    } catch (err) {
      setRecords(records.map(r => r.id === id ? { ...r, ...updates } : r));
    }
  };

  const handlePrescribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (prescribeModal && newMeds) {
      updateRecord(prescribeModal.id, { medicines: newMeds, status: 'prescribed' });
      setPrescribeModal(null);
      setNewMeds('');
    }
  };

  const getStatusBadge = (status: RecordStatus) => {
    switch (status) {
      case 'pending': return <span className="bg-orange-500/20 text-orange-800 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-500/30">Awaiting Nurse</span>;
      case 'prescribed': return <span className="bg-blue-500/20 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-500/30">Prescribed</span>;
      case 'ordered': return <span className="bg-purple-500/20 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-500/30">Meds Ordered</span>;
      case 'cured': return <span className="bg-green-500/20 text-green-800 px-2 py-0.5 rounded text-[10px] font-bold border border-green-500/30">Cured / Done</span>;
      default: return null;
    }
  };

  const filteredRecords = records.filter(r => 
    r.register_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mesh-bg min-h-screen text-gray-800 font-sans flex flex-col md:flex-row overflow-hidden relative">
      
      {/* GLOBAL FLOATING SOS BUTTON */}
      <button 
        onClick={() => setActivePathway('sos')}
        className="fixed bottom-20 right-6 md:bottom-10 md:right-10 bg-red-600 text-white p-4 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.6)] z-[100] hover:scale-105 transition-transform flex items-center justify-center border-2 border-white/50 md:hidden"
      >
         <AlertCircle className="w-8 h-8 animate-pulse" />
      </button>

      {/* DESKTOP SIDEBAR - GLASSMORPHISM */}
      <aside className="hidden md:flex w-64 glass-panel m-4 mr-0 rounded-3xl flex-col justify-between z-20 shadow-2xl">
        <div>
          <div className="p-6 pb-4 flex flex-col items-center border-b border-white/20">
            <div className="w-12 h-12 bg-white/50 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-white/60">
              <Heart className="text-teal-600 w-6 h-6" />
            </div>
            <h1 className="font-bold text-lg text-center text-gray-900">ArogyaLink</h1>
            <p className="text-[10px] text-gray-600 font-medium tracking-wide">Rural Health Connected</p>
          </div>
          <nav className="p-3 space-y-1 mt-2">
            <SidebarItem icon={Home} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={Calendar} label="Appointments" active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
            <SidebarItem icon={FileText} label="Patient Records" active={activeTab === 'records'} onClick={() => setActiveTab('records')} />
            <SidebarItem icon={MessageSquare} label="Consultations" active={activeTab === 'consultations'} onClick={() => setActiveTab('consultations')} />
          </nav>
        </div>
        <div className="p-4 border-t border-white/20">
          <div className="glass-panel p-3 rounded-2xl flex items-center gap-3 relative group cursor-pointer hover:bg-white/40 transition" onClick={() => setCurrentUser({...currentUser, role: currentUser.role === 'patient' ? 'asha' : 'patient'})}>
            <div className="w-10 h-10 bg-white/60 rounded-full flex items-center justify-center border border-white shrink-0">
              <User className="text-teal-700 w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-sm text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-gray-600 font-bold">My Profile</p>
            </div>
            <User className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors shrink-0" />
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV - GLASSMORPHISM */}
      <nav className="md:hidden fixed bottom-0 w-full glass-panel z-50 flex justify-around p-4 rounded-t-3xl border-t border-white/40 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-safe">
         <NavIcon icon={Home} label="Home" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
         <NavIcon icon={FileText} label="Records" active={activeTab === 'records'} onClick={() => setActiveTab('records')} />
         <NavIcon icon={Video} label="Consult" active={activeTab === 'consultations'} onClick={() => setActiveTab('consultations')} />
         <NavIcon icon={User} label="Profile" active={false} onClick={() => setCurrentUser({...currentUser, role: currentUser.role === 'patient' ? 'asha' : 'patient'})} />
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

        {activeTab === 'dashboard' ? (
          <>
            {/* HERO SECTION: PATIENT LOOKUP OR REQUEST */}
            {role === 'patient' ? (
              <section className="glass-panel rounded-3xl p-5 md:p-8 mb-4 shadow-md border border-white/60 text-center">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Need Medical Help?</h2>
                <p className="text-gray-600 mb-4 font-medium text-sm">Submit your symptoms and requested medicines. The village nurse will review and prescribe.</p>
                <form onSubmit={handlePatientSubmit} className="flex flex-col gap-3 max-w-xl mx-auto">
                  <input required type="text" placeholder="Your Name" value={patientName} onChange={e=>setPatientName(e.target.value)} className="bg-white/60 border border-white/50 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                  <input required type="text" placeholder="Describe your problem..." value={patientProblem} onChange={e=>setPatientProblem(e.target.value)} className="bg-white/60 border border-white/50 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500" />
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input type="text" placeholder="Medicines needed (Optional)" value={patientReqMeds} onChange={e=>setPatientReqMeds(e.target.value)} className="bg-white/60 border border-white/50 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 flex-1" />
                    <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 px-6 text-sm rounded-xl shadow-lg transition">Submit Request</button>
                  </div>
                </form>
              </section>
            ) : (
              <section className="glass-panel rounded-3xl p-5 md:p-8 mb-4 flex flex-col items-center justify-center text-center shadow-md">
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Who are we treating today?</h2>
                <p className="text-gray-600 mb-4 max-w-md font-medium text-sm">Search existing patients via ID to view records, or add a new patient instantly.</p>
                <div className="w-full max-w-xl flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 bg-white/60 backdrop-blur-xl border border-white/50 rounded-xl flex items-center p-1.5 shadow-inner">
                    <Search className="w-5 h-5 text-teal-600 ml-3 mr-2" />
                    <input type="text" placeholder="Enter ABHA ID or Name..." className="bg-transparent border-none outline-none flex-1 text-base text-gray-800 p-1 placeholder-gray-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 text-sm rounded-xl shadow-lg transition-transform active:scale-95 whitespace-nowrap">Search Record</button>
                </div>
              </section>
            )}

            {/* 3 PRIMARY ACTION CARDS (GRID) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 relative z-10">
              <button onClick={() => setActiveTab('medicines')} className="glass-panel rounded-2xl p-5 md:p-6 text-left transition-all hover:scale-[1.02] hover:bg-white/50 group cursor-pointer border border-white/60">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors"><Pill className="w-6 h-6" /></div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Find My Medicine</h3>
                <p className="text-gray-600 font-medium text-xs">Locate nearby inventory and check real-time stock at PHCs/Sub-Centres.</p>
              </button>
              <button onClick={() => setActiveTab('consultations')} className="glass-panel rounded-2xl p-5 md:p-6 text-left transition-all hover:scale-[1.02] hover:bg-white/50 group cursor-pointer border border-white/60">
                <div className="w-12 h-12 bg-purple-500/20 text-purple-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors"><Stethoscope className="w-6 h-6" /></div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Smart Guide & Video</h3>
                <p className="text-gray-600 font-medium text-xs">Triage symptoms & connect with city specialists via teleconsultation.</p>
              </button>
              <button onClick={() => setActivePathway('sos')} className="glass-panel-red rounded-2xl p-5 md:p-6 text-left transition-all hover:scale-[1.02] group cursor-pointer relative overflow-hidden hidden md:block">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="w-12 h-12 bg-red-500/30 text-red-700 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500/40 transition-colors border border-red-500/20"><AlertCircle className="w-6 h-6" /></div>
                <h3 className="text-lg font-bold text-red-900 mb-1">Red SOS Button</h3>
                <p className="text-red-800/80 font-medium text-xs">Trigger 108 emergency escalation for critical cases & reserve beds.</p>
              </button>
            </section>

            {/* SUPABASE RECORDS LIST */}
            <section className="glass-panel rounded-2xl p-5 md:p-6 relative z-10 shadow-lg">
              <div className="flex justify-between items-center mb-4 border-b border-white/30 pb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{role === 'nurse' ? 'Recent Patient Records' : 'My Health Requests'}</h3>
                  <p className="text-[10px] text-gray-600">Synced via Supabase</p>
                </div>
                {role === 'nurse' && (
                  <button onClick={() => setActiveTab('records')} className="bg-white/50 hover:bg-white/80 border border-white/60 text-gray-800 font-bold py-1.5 px-3 rounded-lg transition text-xs flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5" /> Manage All
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <p className="text-gray-500 text-sm font-medium col-span-full">Loading records...</p>
                ) : filteredRecords.length === 0 ? (
                  <p className="text-gray-500 text-sm font-medium col-span-full">No records found.</p>
                ) : (
                  filteredRecords.map((record) => (
                    <div key={record.id} className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900 text-base leading-tight">{record.name}</h4>
                            <p className="text-[10px] font-semibold text-teal-700 bg-teal-500/10 px-2 py-0.5 rounded inline-block mt-1">ID: {record.register_id}</p>
                          </div>
                          {getStatusBadge(record.status)}
                        </div>
                        <div className="space-y-1 mb-4 bg-white/30 p-2 rounded-lg border border-white/40">
                          <p className="text-xs text-gray-800"><span className="text-gray-500 font-medium">Problem:</span> {record.problem}</p>
                          <p className="text-xs text-gray-800"><span className="text-gray-500 font-medium">Meds:</span> <span className="font-bold">{record.medicines}</span></p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-auto">
                        {role === 'nurse' && record.status === 'pending' && (
                          <button onClick={() => setPrescribeModal(record)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 transition shadow"><Stethoscope className="w-3 h-3" /> Prescribe</button>
                        )}
                        {role === 'nurse' && record.status === 'prescribed' && (
                          <button onClick={() => updateRecord(record.id, { status: 'ordered' })} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 transition shadow" title="Order for PWD/Old/In-Hospital patients"><ShoppingBag className="w-3 h-3" /> Nurse Order</button>
                        )}
                        {role === 'patient' && record.status === 'prescribed' && (
                          <button onClick={() => updateRecord(record.id, { status: 'ordered' })} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 transition shadow"><ShoppingBag className="w-3 h-3" /> Place Order to Home</button>
                        )}
                        {role === 'nurse' && record.status !== 'cured' && (
                          <button onClick={() => updateRecord(record.id, { status: 'cured' })} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 transition shadow"><CheckCircle className="w-3 h-3" /> Mark Cured</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        ) : activeTab === 'appointments' ? (
          <section className="glass-panel rounded-3xl p-5 md:p-8 flex flex-col gap-6 shadow-md">
            <div className="flex justify-between items-center border-b border-white/30 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Hospital Appointments</h2>
                <p className="text-gray-600 text-sm">Find nearby hospitals and book slots instantly.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'District Hospital, Gadchiroli', distance: '12 km', rating: '4.8', slots: 5 },
                { name: 'Primary Health Centre, Bhamragad', distance: '2 km', rating: '4.2', slots: 12 },
                { name: 'City Specialist Clinic', distance: '45 km', rating: '4.9', slots: 2 },
              ].map((h, i) => (
                <div key={i} className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-5 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg leading-tight">{h.name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><span className="text-teal-600">📍</span> {h.distance}</span>
                        <span className="flex items-center gap-1 text-yellow-600 font-bold">★ {h.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-3 border border-white/40 flex justify-between items-center">
                     <span className="text-xs font-bold text-gray-700">Available Today: <span className="text-teal-700">{bookedHospitals.includes(i) ? h.slots - 1 : h.slots} slots</span></span>
                     <button 
                       onClick={() => setBookingModal({ index: i, name: h.name })} 
                       disabled={bookedHospitals.includes(i)} 
                       className={`${bookedHospitals.includes(i) ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'} text-white text-xs font-bold py-1.5 px-4 rounded-lg shadow transition`}
                     >
                       {bookedHospitals.includes(i) ? '✓ Booked' : 'Book Slot'}
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : activeTab === 'consultations' ? (
          <section className="glass-panel rounded-3xl p-5 md:p-8 flex flex-col gap-6 shadow-md">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Video Consultations & First Aid</h2>
              <p className="text-gray-600 text-sm">Speak to a doctor live, or watch reference videos for minor issues.</p>
            </div>
            
            <div className="bg-purple-600/10 border border-purple-600/20 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
               <div>
                  <h3 className="text-xl font-bold text-purple-900 mb-2">Live Doctor Consultation</h3>
                  <p className="text-purple-800/80 text-sm mb-4">For severe or unknown symptoms, connect with a city specialist instantly via high-quality video call.</p>
                  <button onClick={() => setIsVideoCallActive(true)} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition flex items-center gap-2">
                    <Video className="w-5 h-5" /> Start Video Call Now
                  </button>
               </div>
               <div className="w-24 h-24 bg-purple-200 rounded-full flex items-center justify-center animate-pulse">
                  <Video className="w-10 h-10 text-purple-600" />
               </div>
            </div>

            <h3 className="font-bold text-gray-900 text-lg mt-4 border-b border-white/30 pb-2">First Aid Reference Videos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {[
                 { title: 'Snake Bite First Aid', color: 'bg-red-500/10' },
                 { title: 'Treating High Fever', color: 'bg-orange-500/10' },
                 { title: 'Dressing a Wound', color: 'bg-blue-500/10' }
               ].map((v, i) => (
                 <div key={i} className={`${v.color} backdrop-blur-md border border-white/60 rounded-xl p-4 shadow-sm flex flex-col justify-between aspect-video relative group cursor-pointer overflow-hidden`}>
                   <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-gray-800 font-bold ml-1">▶</span>
                      </div>
                   </div>
                   <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/60 to-transparent">
                      <h4 className="font-bold text-white text-sm">{v.title}</h4>
                   </div>
                 </div>
               ))}
            </div>
          </section>
        ) : activeTab === 'records' ? (
          <section className="glass-panel rounded-3xl p-5 md:p-8 flex flex-col gap-6 shadow-md">
            <div className="flex justify-between items-center border-b border-white/30 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Health Tracker</h2>
                <p className="text-gray-600 text-sm">Track your vitals, diet, and medication timings.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Checklist */}
              <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-5 shadow-sm">
                 <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">📋 Daily Reminders</h3>
                 <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-white/50 rounded-lg cursor-pointer hover:bg-white transition">
                      <input type="checkbox" className="w-5 h-5 accent-teal-600 rounded" />
                      <div>
                        <p className="font-bold text-sm text-gray-800">Morning Tablets (Paracetamol)</p>
                        <p className="text-[10px] text-gray-500">Scheduled at 08:00 AM</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white/50 rounded-lg cursor-pointer hover:bg-white transition">
                      <input type="checkbox" className="w-5 h-5 accent-teal-600 rounded" />
                      <div>
                        <p className="font-bold text-sm text-gray-800">Drink Fresh Fruit Juice</p>
                        <p className="text-[10px] text-gray-500">Scheduled at 11:00 AM</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white/50 rounded-lg cursor-pointer hover:bg-white transition">
                      <input type="checkbox" className="w-5 h-5 accent-teal-600 rounded" />
                      <div>
                        <p className="font-bold text-sm text-gray-800">Night Tablets (Aspirin)</p>
                        <p className="text-[10px] text-gray-500">Scheduled at 09:00 PM</p>
                      </div>
                    </label>
                 </div>
              </div>

              {/* Vitals Tracker */}
              <div className="bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-5 shadow-sm flex flex-col gap-4">
                 <h3 className="font-bold text-gray-900 flex items-center gap-2">❤️ Record Vitals</h3>
                 
                 <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-red-800 font-bold mb-1">Blood Pressure (BP)</p>
                      <p className="text-2xl font-black text-red-900">{vitals.bp.split('/')[0]}<span className="text-sm font-medium text-red-700">/{vitals.bp.split('/')[1] || ''}</span></p>
                    </div>
                    <button onClick={() => handleLogVitals('bp')} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow">Log New BP</button>
                 </div>

                 <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-800 font-bold mb-1">Blood Sugar (Fasting)</p>
                      <p className="text-2xl font-black text-blue-900">{vitals.sugar} <span className="text-sm font-medium text-blue-700">mg/dL</span></p>
                    </div>
                    <button onClick={() => handleLogVitals('sugar')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow">Log Sugar</button>
                 </div>
              </div>
            </div>

          </section>
        ) : activeTab === 'medicines' ? (
          <section className="glass-panel rounded-3xl p-5 md:p-8 flex flex-col gap-6 shadow-md">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Find My Medicine</h2>
              <p className="text-gray-600 text-sm">Search for prescribed medicines and request delivery from nearby PHCs or Medical Shops.</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-xl flex items-center p-2 shadow-inner">
              <Search className="w-6 h-6 text-teal-600 ml-3 mr-2" />
              <input type="text" placeholder="Search for Paracetamol, Insulin, etc..." className="bg-transparent border-none outline-none flex-1 text-lg text-gray-800 p-2 placeholder-gray-500" value={medSearchQuery} onChange={e => setMedSearchQuery(e.target.value)} />
            </div>

            {medSearchQuery.length > 2 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'District Hospital Pharmacy', distance: '12 km', stock: 'In Stock (High)', type: 'Government' },
                  { name: 'Sanjivani Medical Store', distance: '1.5 km', stock: 'Limited Stock', type: 'Private Shop' },
                  { name: 'Bhamragad PHC', distance: '3 km', stock: 'Out of Stock', type: 'Government' },
                ].map((shop, i) => (
                  <div key={i} className={`bg-white/40 backdrop-blur-md border border-white/60 rounded-xl p-5 shadow-sm flex flex-col gap-3 ${shop.stock === 'Out of Stock' ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg leading-tight">{shop.name}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs font-bold text-gray-600">
                          <span className="flex items-center gap-1"><span className="text-teal-600">📍</span> {shop.distance}</span>
                          <span className="text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{shop.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3 border border-white/40 flex justify-between items-center">
                       <span className={`text-xs font-bold ${shop.stock === 'In Stock (High)' ? 'text-green-700' : shop.stock.includes('Limited') ? 'text-yellow-700' : 'text-red-700'}`}>{shop.stock}</span>
                       <button 
                         onClick={() => setDeliveryModal({ medName: medSearchQuery, pharmacy: shop.name })}
                         disabled={shop.stock === 'Out of Stock'}
                         className={`${shop.stock === 'Out of Stock' ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'} text-white text-xs font-bold py-1.5 px-4 rounded-lg shadow transition`}
                       >
                         Request Delivery
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Pill className="w-16 h-16 mb-4 opacity-50 text-teal-600" />
                <p className="text-lg font-medium">Type a medicine name to check local stock.</p>
              </div>
            )}
          </section>
        ) : null}

      </main>

      {/* VIDEO CALL MODAL */}
      {isVideoCallActive && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[120] flex items-center justify-center p-4">
          <div className="bg-gray-900 w-full max-w-4xl h-[80vh] rounded-3xl p-2 shadow-2xl border border-gray-700 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center p-4 text-white">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-bold">Live Teleconsultation</span>
              </div>
              <button onClick={() => setIsVideoCallActive(false)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded-xl transition">End Call</button>
            </div>
            <div className="flex-1 bg-black rounded-2xl relative flex items-center justify-center">
              <Video className="w-16 h-16 text-gray-700 animate-pulse" />
              <p className="absolute bottom-4 left-4 text-gray-500 text-sm">Waiting for doctor to join...</p>
              <div className="absolute top-4 right-4 w-32 h-48 bg-gray-800 border-2 border-gray-700 rounded-xl"></div>
            </div>
          </div>
        </div>
      )}

      {/* BOOK SLOT MODAL */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[105] flex items-center justify-center p-4">
          <div className="glass-panel bg-white/80 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Book Appointment</h2>
            <p className="text-sm text-gray-600 mb-4">Facility: <strong className="text-teal-700">{bookingModal.name}</strong></p>
            <form onSubmit={handleBookSlotSubmit} className="flex flex-col gap-3">
              <input required type="text" placeholder="Patient Name" value={bookingDetails.name} onChange={e=>setBookingDetails({...bookingDetails, name: e.target.value})} className="w-full bg-white/60 border border-white/50 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500" />
              <input required type="text" placeholder="Reason for visit..." value={bookingDetails.reason} onChange={e=>setBookingDetails({...bookingDetails, reason: e.target.value})} className="w-full bg-white/60 border border-white/50 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500" />
              
              <div className="flex gap-2">
                <input required type="date" value={bookingDetails.date} onChange={e=>setBookingDetails({...bookingDetails, date: e.target.value})} className="w-full bg-white/60 border border-white/50 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 flex-1" />
                <select value={bookingDetails.time} onChange={e=>setBookingDetails({...bookingDetails, time: e.target.value})} className="w-full bg-white/60 border border-white/50 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 flex-1">
                  <option value="Morning">Morning (9 AM - 12 PM)</option>
                  <option value="Afternoon">Afternoon (1 PM - 4 PM)</option>
                  <option value="Evening">Evening (5 PM - 8 PM)</option>
                </select>
              </div>
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setBookingModal(null)} className="flex-1 py-2 font-bold text-gray-600 bg-gray-200/50 rounded-xl hover:bg-gray-300/50">Cancel</button>
                <button type="submit" className="flex-1 py-2 font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700 shadow">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEDICINE DELIVERY MODAL */}
      {deliveryModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[105] flex items-center justify-center p-4">
          <div className="glass-panel bg-white/80 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Request Delivery</h2>
            <p className="text-sm text-gray-600 mb-4">You are ordering <strong className="text-teal-700">{deliveryModal.medName}</strong> from <strong className="text-gray-900">{deliveryModal.pharmacy}</strong>.</p>
            <form onSubmit={handleDeliverySubmit} className="flex flex-col gap-3">
              <textarea required rows={3} placeholder="Enter your full home address or village location..." value={deliveryAddress} onChange={e=>setDeliveryAddress(e.target.value)} className="w-full bg-white/60 border border-white/50 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={() => setDeliveryModal(null)} className="flex-1 py-2 font-bold text-gray-600 bg-gray-200/50 rounded-xl hover:bg-gray-300/50">Cancel</button>
                <button type="submit" className="flex-1 py-2 font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700 shadow">Confirm Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NURSE PRESCRIBE MODAL */}
      {prescribeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel bg-white/80 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-white">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Prescribe Medicine</h2>
            <p className="text-sm text-gray-600 mb-4">Patient: <strong className="text-gray-900">{prescribeModal.name}</strong><br/>Problem: {prescribeModal.problem}</p>
            <form onSubmit={handlePrescribe}>
              <input required type="text" placeholder="Enter medicine & dosage..." value={newMeds} onChange={e=>setNewMeds(e.target.value)} className="w-full bg-white/60 border border-white/50 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 mb-4" />
              <div className="flex gap-2">
                <button type="button" onClick={() => setPrescribeModal(null)} className="flex-1 py-2 font-bold text-gray-600 bg-gray-200/50 rounded-xl hover:bg-gray-300/50">Cancel</button>
                <button type="submit" className="flex-1 py-2 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow">Approve</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMERGENCY SOS MODAL */}
      {activePathway === 'sos' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4" onClick={() => setActivePathway(null)}>
          <div className="bg-red-50 w-full max-w-md rounded-3xl p-8 shadow-2xl border-4 border-red-500 text-center relative" onClick={e => e.stopPropagation()}>
             <button onClick={() => setActivePathway(null)} className="absolute top-4 right-4 w-8 h-8 bg-red-200 text-red-800 rounded-full font-bold flex items-center justify-center">×</button>
             <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
               <AlertCircle className="w-10 h-10" />
             </div>
             <h3 className="text-2xl font-extrabold text-red-700 mb-2">TRIGGER 108 EMERGENCY</h3>
             <p className="text-red-900/80 mb-6 font-medium text-sm">This will instantly dispatch an ambulance and reserve an emergency bed at the nearest District Hospital.</p>
             <button className="bg-red-600 hover:bg-red-700 text-white font-black py-4 px-8 w-full rounded-2xl shadow-xl shadow-red-600/30 text-lg transition-transform active:scale-95">CONFIRM SOS DISPATCH</button>
          </div>
        </div>
      )}

    </div>
  );
}

function SidebarItem({ icon: Icon, label, active = false, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all ${active ? 'bg-teal-600/10 text-teal-800 font-bold border border-teal-600/20' : 'text-gray-600 hover:bg-white/40 hover:text-gray-900 font-medium'}`}>
      <Icon className={`w-5 h-5 ${active ? 'text-teal-700' : ''}`} />
      <span>{label}</span>
    </div>
  );
}

function NavIcon({ icon: Icon, label, active = false, onClick }: any) {
  return (
    <div onClick={onClick} className="flex flex-col items-center gap-1 cursor-pointer">
      <div className={`p-2 rounded-xl ${active ? 'bg-teal-600/20' : ''}`}>
         <Icon className={`w-6 h-6 ${active ? 'text-teal-700' : 'text-gray-500'}`} />
      </div>
      <span className={`text-[10px] font-bold ${active ? 'text-teal-800' : 'text-gray-500'}`}>{label}</span>
    </div>
  );
}
