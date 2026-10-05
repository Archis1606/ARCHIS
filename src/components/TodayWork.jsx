import React, { useState } from 'react';
import { 
  Plus, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Database, 
  Download, 
  X, 
  Check,
  FileText,
  User,
  Phone,
  Compass,
  AlignLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
  Play
} from 'lucide-react';

const INITIAL_TASKS = [
  {
    id: 'TSK-2026-01',
    title: 'Disputed Boundary Survey & Encroachment Check',
    department: 'Field Workers',
    assignee: 'FW-04 (Rajinder S.)',
    priority: 'High',
    status: 'In Progress',
    deadline: 'Today, 16:00',
    dispatchedAt: 'Oct 5, 2026, 09:15 AM',
    description: 'Verify physical boundaries against GIS satellite overlay and cross-check disputed pillar #42 with local witnesses. Ensure all perimeter discrepancies are properly recorded in the field log.',
    location: 'Sector 4, Amritsar North',
    ulPin: 'PB-LDH-2026-984124',
    landOwner: 'Sukhdev Singh',
    ownerPhone: '+91 98765 43210',
    coordinates: '31.6340° N, 74.8723° E',
  },
  {
    id: 'TSK-2026-02',
    title: 'Jamabandi Historical Chain Anomaly Resolution',
    department: 'Technical Workers',
    assignee: 'TECH-02 (Amanpreet K.)',
    priority: 'Medium',
    status: 'Pending',
    deadline: 'Today, 18:00',
    dispatchedAt: 'Oct 5, 2026, 08:30 AM',
    description: 'Cross-verify mismatch between 2012 mutation entry and current RoR digital ledger to clear audit flags.',
    khataNo: 'Khata No. 89 / Khewat 42',
    anomalyType: 'Name Mismatch in Land Owner Records',
    ulPin: 'PB-LDH-2026-984124',
    landOwnerOnRecord: 'Gurpreet Singh',
    landOwnerPortal: 'Gurpreet S. Brar',
  },
  {
    id: 'TSK-2026-03',
    title: 'Legacy Register Volume Scan & Incomplete Document Audit',
    department: 'Work Uploaders',
    assignee: 'UPL-01 (Vikram M.)',
    priority: 'Urgent',
    status: 'Pending',
    deadline: 'Today, 14:30',
    dispatchedAt: 'Oct 5, 2026, 07:45 AM',
    description: 'Audit scanned land record registers for Volume 4B. Flagged documents require manual verification and missing record upload.',
    registerVolume: 'Volume 4B (Village Chheharta)',
    ulPin: 'PB-LDH-2026-984124',
    incompleteDocs: [
      'Mutation Deed 2018 (Missing Page 3 signature seal)',
      'RoR Jamabandi Naksha (Incomplete boundary sketch stamp)',
      'Partition Mutation Order (Missing co-sharer consent annexure)'
    ],
    targetNode: 'District Record Room DB-02',
  },
];

export default function TodaysWork({ onNavigateToVerification }) {
  const [activeRole, setActiveRole] = useState('area-head'); 
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  
  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFieldProofModalOpen, setIsFieldProofModalOpen] = useState(false);

  // Expanded task ID toggles for workers
  const [expandedFieldTaskId, setExpandedFieldTaskId] = useState(null);
  const [expandedTechTaskId, setExpandedTechTaskId] = useState(null);
  const [expandedUploaderTaskId, setExpandedUploaderTaskId] = useState(null);

  // Dynamic Task Assignment Form State
  const [assignDept, setAssignDept] = useState('Field Workers');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [deadline, setDeadline] = useState('Today, 17:00');
  
  // Department-specific state fields
  const [coordinates, setCoordinates] = useState('');
  const [ulPin, setUlPin] = useState('');
  const [landOwner, setLandOwner] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [location, setLocation] = useState('');

  const [khataNo, setKhataNo] = useState('');
  const [anomalyType, setAnomalyType] = useState('');

  const [registerVolume, setRegisterVolume] = useState('');
  const [targetNode, setTargetNode] = useState('');
  const [incompleteDocsInput, setIncompleteDocsInput] = useState('');

  const handleCreateTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle) return;

    const now = new Date();
    const formattedDispatchTime = now.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const newTask = {
      id: `TSK-2026-${Math.floor(10 + Math.random() * 90)}`,
      title: taskTitle,
      department: assignDept,
      assignee: assignDept === 'Field Workers' ? 'FW-09' : assignDept === 'Technical Workers' ? 'TECH-05' : 'UPL-03',
      priority: 'Medium',
      status: 'Pending',
      deadline: deadline,
      dispatchedAt: formattedDispatchTime,
      description: taskDescription || `District Officer Assigned Task for ${assignDept}`,
      ...(assignDept === 'Field Workers' && { coordinates, ulPin: ulPin || 'PB-LDH-2026-984124', landOwner, ownerPhone, location }),
      ...(assignDept === 'Technical Workers' && { khataNo, anomalyType: anomalyType || 'Name Mismatch in Land Owner Records', ulPin: ulPin || 'PB-LDH-2026-984124' }),
      ...(assignDept === 'Work Uploaders' && { 
        registerVolume: registerVolume || 'Volume 9C (Village Sultanwind)', 
        ulPin: ulPin || 'PB-LDH-2026-984124',
        targetNode: targetNode || 'District Record Room DB-01',
        incompleteDocs: incompleteDocsInput ? incompleteDocsInput.split(',').map(s => s.trim()) : ['Mutation Deed (Missing Seal)', 'RoR Naksha (Incomplete Stamp)']
      }),
    };

    setTasks([newTask, ...tasks]);
    setIsAssignModalOpen(false);
    
    // Reset form
    setTaskTitle('');
    setTaskDescription('');
    setDeadline('Today, 17:00');
    setCoordinates('');
    setUlPin('');
    setLandOwner('');
    setOwnerPhone('');
    setLocation('');
    setKhataNo('');
    setAnomalyType('');
    setRegisterVolume('');
    setTargetNode('');
    setIncompleteDocsInput('');
  };

  const handleFieldTaskClick = (task) => {
    const isExpanding = expandedFieldTaskId !== task.id;
    setExpandedFieldTaskId(isExpanding ? task.id : null);

    if (isExpanding && task.status === 'Pending') {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'In Progress' } : t));
    }
  };

  const handleTechTaskClick = (task) => {
    const isExpanding = expandedTechTaskId !== task.id;
    setExpandedTechTaskId(isExpanding ? task.id : null);

    if (isExpanding && task.status === 'Pending') {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'In Progress' } : t));
    }
  };

  const handleUploaderTaskClick = (task) => {
    const isExpanding = expandedUploaderTaskId !== task.id;
    setExpandedUploaderTaskId(isExpanding ? task.id : null);

    if (isExpanding && task.status === 'Pending') {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'In Progress' } : t));
    }
  };

  const handleFieldSubmit = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Completed', fieldProofUploaded: true, signedDocUploaded: true } : t));
    setIsFieldProofModalOpen(false);
    setSelectedTask(null);
  };

  const handleTechClear = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'Completed', anomalyCleared: true } : t));
  };

  // Trigger redirection to DocumentVerification page session
  const handleStartUploaderTask = (task) => {
    // Update status to In Progress on master table
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'In Progress' } : t));
    
    // If external navigation prop is provided, call it with task payload
    if (onNavigateToVerification) {
      onNavigateToVerification(task);
    } else {
      alert(`Redirecting session for ${task.id} (${task.registerVolume}) to Document Verification page...`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 font-sans text-zinc-100 bg-[#09090b] min-h-screen border border-zinc-800/60 rounded-xl my-4 shadow-2xl">
      
      {/* Top Header & Role Switcher */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            District Governance Engine · Node Amritsar-01
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mt-1 text-white">Operations Command & Task Ledger</h1>
        </div>

        <nav className="flex items-center bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 text-xs gap-1 shadow-inner">
          {[
            { id: 'area-head', label: 'Area Head (Officer)' },
            { id: 'field-worker', label: 'Field Worker (FW)' },
            { id: 'tech-worker', label: 'Technical Dept' },
            { id: 'uploader', label: 'OCR Uploaders' },
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeRole === role.id 
                  ? 'bg-zinc-800 text-white shadow-md border border-zinc-700/60' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {role.label}
            </button>
          ))}
        </nav>
      </header>

      {/* ================= AREA HEAD / OFFICER VIEW ================= */}
      {activeRole === 'area-head' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="grid grid-cols-3 gap-4 w-full sm:w-auto">
              <div className="px-5 py-3 bg-zinc-900/55 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 font-mono tracking-wider">TOTAL TASKS</span>
                <p className="text-2xl font-semibold text-white mt-0.5">{tasks.length}</p>
              </div>
              <div className="px-5 py-3 bg-zinc-900/55 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 font-mono tracking-wider">RESOLVED</span>
                <p className="text-2xl font-semibold text-emerald-400 mt-0.5">{tasks.filter(t => t.status === 'Completed').length}</p>
              </div>
              <div className="px-5 py-3 bg-zinc-900/55 border border-zinc-800 rounded-xl">
                <span className="text-xs text-zinc-400 font-mono tracking-wider">PENDING</span>
                <p className="text-2xl font-semibold text-amber-400 mt-0.5">{tasks.filter(t => t.status !== 'Completed').length}</p>
              </div>
            </div>

            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-sm px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" /> Assign New Task
            </button>
          </div>

          <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/20 shadow-lg">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/70 text-zinc-400 font-mono text-xs uppercase tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Assignee</th>
                  <th className="p-4">Dispatched At</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {tasks.map((task) => (
                  <tr key={task.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-4 font-mono text-zinc-400 text-xs">{task.id}</td>
                    <td className="p-4 font-medium text-zinc-200">{task.title}</td>
                    <td className="p-4 text-zinc-400">{task.department}</td>
                    <td className="p-4 font-mono text-zinc-400 text-xs">{task.assignee}</td>
                    <td className="p-4 text-zinc-400 text-xs font-mono">{task.dispatchedAt || 'N/A'}</td>
                    <td className="p-4 text-zinc-400 text-xs">{task.deadline}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono ${
                        task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 
                        task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' : 
                        'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                      }`}>
                        {task.status === 'Completed' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= FIELD WORKER VIEW ================= */}
      {activeRole === 'field-worker' && (
        <div className="space-y-4">
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between text-xs font-mono shadow-sm">
            <span className="text-zinc-400">SESSION ID: <strong className="text-zinc-200">FW-04 (Rajinder Singh)</strong></span>
            <span className="text-blue-400">Site Inspection & Compliance Unit (Click blocks to read & auto-sync)</span>
          </div>

          <div className="space-y-4">
            {tasks.filter(t => t.department === 'Field Workers').map((task) => {
              const isExpanded = expandedFieldTaskId === task.id;
              return (
                <div 
                  key={task.id} 
                  onClick={() => handleFieldTaskClick(task)}
                  className={`p-5 bg-zinc-900/40 border rounded-xl space-y-4 shadow-md transition-all cursor-pointer ${
                    isExpanded ? 'border-blue-500/60 bg-zinc-900/70 shadow-blue-500/10' : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs text-zinc-500">{task.id}</span>
                        <h3 className="text-base font-medium text-white">{task.title}</h3>
                        <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">Dispatched: {task.dispatchedAt}</span>
                      </div>
                      <p className="text-sm text-zinc-300 line-clamp-1">{task.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono ${
                        task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 
                        task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' : 
                        'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                      }`}>
                        {task.status}
                      </span>

                      {task.status === 'Completed' ? (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
                          <Check className="w-4 h-4" /> Verified & Signed
                        </span>
                      ) : (
                        <button
                          onClick={() => { setSelectedTask(task); setIsFieldProofModalOpen(true); }}
                          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-md"
                        >
                          <MapPin className="w-4 h-4" /> Upload Field Proof
                        </button>
                      )}

                      <button 
                        onClick={() => handleFieldTaskClick(task)}
                        className="text-zinc-400 hover:text-zinc-200 p-2 rounded-lg bg-zinc-950 border border-zinc-800"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pt-4 mt-2 border-t border-zinc-800/80 space-y-4 animate-fadeIn text-sm">
                      <div className="space-y-1.5 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-medium">Detailed Instructions & Scope</span>
                        <p className="text-zinc-200 leading-relaxed">{task.description}</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
                        <div><span className="text-zinc-500 block mb-1">UL PIN:</span> <span className="text-zinc-200 font-medium">{task.ulPin || 'N/A'}</span></div>
                        <div><span className="text-zinc-500 block mb-1">Coordinates:</span> <span className="text-zinc-200 font-medium">{task.coordinates || 'N/A'}</span></div>
                        <div><span className="text-zinc-500 block mb-1">Owner Name:</span> <span className="text-zinc-200 font-medium">{task.landOwner || 'N/A'}</span></div>
                        <div><span className="text-zinc-500 block mb-1">Owner Contact:</span> <span className="text-zinc-200 font-medium">{task.ownerPhone || 'N/A'}</span></div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-mono text-zinc-400">Target ULPIN Record Link: <code className="text-blue-400">PB-LDH-2026-984124</code></span>
                        <a 
                          href="http://localhost:5173/land/PB-LDH-2026-984124" 
                          target="_blank" 
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-medium transition-all"
                        >
                          View all information (Land Records) <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TECHNICAL WORKER VIEW ================= */}
      {activeRole === 'tech-worker' && (
        <div className="space-y-4">
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between text-xs font-mono shadow-sm">
            <span className="text-zinc-400">SESSION ID: <strong className="text-zinc-200">TECH-02 (Amanpreet Kaur)</strong></span>
            <span className="text-purple-400">Online Record & Anomaly Resolution (Click blocks to read & auto-sync)</span>
          </div>

          <div className="space-y-4">
            {tasks.filter(t => t.department === 'Technical Workers').map((task) => {
              const isExpanded = expandedTechTaskId === task.id;
              return (
                <div 
                  key={task.id} 
                  onClick={() => handleTechTaskClick(task)}
                  className={`p-5 bg-zinc-900/40 border rounded-xl space-y-4 shadow-md transition-all cursor-pointer ${
                    isExpanded ? 'border-purple-500/60 bg-zinc-900/70 shadow-purple-500/10' : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs text-zinc-500">{task.id}</span>
                        <h3 className="text-base font-medium text-white">{task.title}</h3>
                        <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">Dispatched: {task.dispatchedAt}</span>
                      </div>
                      <p className="text-sm text-zinc-300 line-clamp-1">{task.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono ${
                        task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 
                        task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' : 
                        'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                      }`}>
                        {task.status}
                      </span>

                      {task.status === 'Completed' ? (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
                          <Check className="w-4 h-4" /> Anomaly Cleared
                        </span>
                      ) : (
                        <button
                          onClick={() => handleTechClear(task.id)}
                          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md"
                        >
                          Verify & Clear Anomaly
                        </button>
                      )}

                      <button 
                        onClick={() => handleTechTaskClick(task)}
                        className="text-zinc-400 hover:text-zinc-200 p-2 rounded-lg bg-zinc-950 border border-zinc-800"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pt-4 mt-2 border-t border-zinc-800/80 space-y-4 animate-fadeIn text-sm">
                      <div className="space-y-1.5 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
                        <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-medium">Anomaly Audit & Description</span>
                        <p className="text-zinc-200 leading-relaxed">{task.description}</p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
                        <div><span className="text-zinc-500 block mb-1">Khata / Khewat:</span> <span className="text-zinc-200 font-medium">{task.khataNo || 'Khata No. 89'}</span></div>
                        <div><span className="text-zinc-500 block mb-1">Anomaly Type:</span> <span className="text-purple-400 font-medium">{task.anomalyType || 'Name Mismatch'}</span></div>
                        <div><span className="text-zinc-500 block mb-1">Registry Name:</span> <span className="text-zinc-200 font-medium">{task.landOwnerOnRecord || 'Gurpreet Singh'}</span></div>
                        <div><span className="text-zinc-500 block mb-1">Portal Name:</span> <span className="text-amber-400 font-medium">{task.landOwnerPortal || 'Gurpreet S. Brar'}</span></div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-mono text-zinc-400">Target ULPIN Record Link: <code className="text-purple-400">{task.ulPin || 'PB-LDH-2026-984124'}</code></span>
                        <a 
                          href={`http://localhost:5173/land/${task.ulPin || 'PB-LDH-2026-984124'}`} 
                          target="_blank" 
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-medium transition-all"
                        >
                          View all information (Land Records) <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= OCR UPLOADERS VIEW (WITH REGISTER VOLUMES, INCOMPLETE DOCS & START TASK) ================= */}
      {activeRole === 'uploader' && (
        <div className="space-y-4">
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between text-xs font-mono shadow-sm">
            <span className="text-zinc-400">SESSION ID: <strong className="text-zinc-200">UPL-01 (Vikram Malhotra)</strong></span>
            <span className="text-amber-400">OCR Register Volumes & Incomplete Document Audit (Click blocks to read & start verification)</span>
          </div>

          <div className="space-y-4">
            {tasks.filter(t => t.department === 'Work Uploaders').map((task) => {
              const isExpanded = expandedUploaderTaskId === task.id;
              return (
                <div 
                  key={task.id} 
                  onClick={() => handleUploaderTaskClick(task)}
                  className={`p-5 bg-zinc-900/40 border rounded-xl space-y-4 shadow-md transition-all cursor-pointer ${
                    isExpanded ? 'border-amber-500/60 bg-zinc-900/70 shadow-amber-500/10' : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs text-zinc-500">{task.id}</span>
                        <h3 className="text-base font-medium text-white">{task.title}</h3>
                        <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">Dispatched: {task.dispatchedAt}</span>
                      </div>
                      <p className="text-sm text-zinc-300 line-clamp-1">{task.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono ${
                        task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' : 
                        task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25' : 
                        'bg-amber-500/10 text-amber-400 border border-amber-500/25'
                      }`}>
                        {task.status}
                      </span>

                      {task.status === 'Completed' ? (
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
                          <Check className="w-4 h-4" /> Completed & Synced
                        </span>
                      ) : (
                        <button
                          onClick={() => handleStartUploaderTask(task)}
                          className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-md hover:scale-[1.02]"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" /> Start Task
                        </button>
                      )}

                      <button 
                        onClick={() => handleUploaderTaskClick(task)}
                        className="text-zinc-400 hover:text-zinc-200 p-2 rounded-lg bg-zinc-950 border border-zinc-800"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Detailed Uploader & Incomplete Document Audit View */}
                  {isExpanded && (
                    <div className="pt-4 mt-2 border-t border-zinc-800/80 space-y-4 animate-fadeIn text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
                          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block font-medium">Register Volume Details</span>
                          <div className="space-y-1 text-xs font-mono">
                            <div><span className="text-zinc-500">Volume Title:</span> <span className="text-zinc-200 font-medium">{task.registerVolume || 'Volume 4B'}</span></div>
                            <div><span className="text-zinc-500">Target DB Node:</span> <span className="text-amber-400 font-medium">{task.targetNode || 'District Record Room DB-02'}</span></div>
                            <div><span className="text-zinc-500">UL PIN:</span> <span className="text-blue-400 font-medium">{task.ulPin || 'PB-LDH-2026-984124'}</span></div>
                          </div>
                        </div>

                        <div className="space-y-2 bg-zinc-950/60 p-4 rounded-xl border border-amber-500/30">
                          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-medium uppercase tracking-wider">
                            <AlertTriangle className="w-4 h-4" /> Incomplete / Missing Documents Flagged
                          </div>
                          <ul className="space-y-1.5 text-xs text-zinc-300 font-mono">
                            {task.incompleteDocs && task.incompleteDocs.map((doc, idx) => (
                              <li key={idx} className="flex items-start gap-2 bg-zinc-900/80 p-2 rounded border border-zinc-800">
                                <span className="text-amber-400 font-bold">•</span>
                                <span className="leading-tight">{doc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-mono text-zinc-400">Target ULPIN Complete Record Link: <code className="text-amber-400">{task.ulPin || 'PB-LDH-2026-984124'}</code></span>
                        <a 
                          href={`http://localhost:5173/land/${task.ulPin || 'PB-LDH-2026-984124'}`} 
                          target="_blank" 
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-medium transition-all"
                        >
                          View all information (Land Records) <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= ASSIGN NEW TASK MODAL ================= */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-semibold text-white">Assign Task to Department</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Specify task details and required parameters for the team. Dispatch timestamp is recorded automatically.</p>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-sm">
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium text-xs uppercase tracking-wider">Target Department Selector</label>
                <select
                  value={assignDept}
                  onChange={(e) => setAssignDept(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm focus:outline-none focus:border-zinc-500 shadow-inner"
                >
                  <option value="Field Workers">Field Workers (Site Verification & Land Survey)</option>
                  <option value="Technical Workers">Technical Workers (Online Records & Anomaly Resolution)</option>
                  <option value="Work Uploaders">Work Uploaders (OCR Digitization & Incomplete Doc Audit)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium text-xs uppercase tracking-wider">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Audit Scanned Land Register Volume 4B"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm focus:outline-none focus:border-zinc-500 shadow-inner"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-zinc-400" />
                  <label className="text-zinc-300 font-medium text-xs uppercase tracking-wider">Detailed Description & Instructions</label>
                </div>
                <textarea
                  rows="3"
                  placeholder="Provide complete context, step-by-step instructions, and compliance standards for the worker..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm focus:outline-none focus:border-zinc-500 shadow-inner resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium text-xs uppercase tracking-wider">Completion Deadline</label>
                <input
                  type="text"
                  placeholder="Today, 18:00"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm focus:outline-none focus:border-zinc-500 shadow-inner"
                />
              </div>

              {assignDept === 'Field Workers' && (
                <div className="p-4 bg-zinc-950/70 border border-blue-500/30 rounded-xl space-y-3.5 shadow-inner">
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-wider block font-medium">Field Worker Mandates & Coordinates</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 text-xs block mb-1.5 font-medium">UL PIN</label>
                      <input type="text" placeholder="PB-LDH-2026-984124" value={ulPin} onChange={(e) => setUlPin(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-200 text-sm focus:outline-none focus:border-blue-500/50" />
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs block mb-1.5 font-medium">GPS Coordinates</label>
                      <input type="text" placeholder="31.6340° N, 74.8723° E" value={coordinates} onChange={(e) => setCoordinates(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-200 text-sm focus:outline-none focus:border-blue-500/50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 text-xs block mb-1.5 font-medium">Land Owner Name</label>
                      <input type="text" placeholder="Full Name" value={landOwner} onChange={(e) => setLandOwner(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-200 text-sm focus:outline-none focus:border-blue-500/50" />
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs block mb-1.5 font-medium">Owner Mobile Number</label>
                      <input type="text" placeholder="+91 XXXXX XXXXX" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-200 text-sm focus:outline-none focus:border-blue-500/50" />
                    </div>
                  </div>

                  <div>
                    <label className="text-zinc-400 text-xs block mb-1.5 font-medium">Site Location / Sector</label>
                    <input type="text" placeholder="Sector / Village Name" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-200 text-sm focus:outline-none focus:border-blue-500/50" />
                  </div>
                </div>
              )}

              {assignDept === 'Technical Workers' && (
                <div className="p-4 bg-zinc-950/70 border border-purple-500/30 rounded-xl space-y-3.5 shadow-inner">
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-wider block font-medium">Technical Department Mandates</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 text-xs block mb-1.5 font-medium">Khata / Khewat No.</label>
                      <input type="text" placeholder="Khata No. 89" value={khataNo} onChange={(e) => setKhataNo(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-200 text-sm focus:outline-none focus:border-purple-500/50" />
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs block mb-1.5 font-medium">Anomaly Tag</label>
                      <input type="text" placeholder="Name Mismatch in Land Owner Records" value={anomalyType} onChange={(e) => setAnomalyType(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-200 text-sm focus:outline-none focus:border-purple-500/50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-zinc-400 text-xs block mb-1.5 font-medium">UL PIN</label>
                    <input type="text" placeholder="PB-LDH-2026-984124" value={ulPin} onChange={(e) => setUlPin(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-200 text-sm focus:outline-none focus:border-purple-500/50" />
                  </div>
                </div>
              )}

              {assignDept === 'Work Uploaders' && (
                <div className="p-4 bg-zinc-950/70 border border-amber-500/30 rounded-xl space-y-3.5 shadow-inner">
                  <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block font-medium">Work Uploaders Mandates & Incomplete Documents</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 text-xs block mb-1.5 font-medium">Register Volume</label>
                      <input type="text" placeholder="Volume 4B" value={registerVolume} onChange={(e) => setRegisterVolume(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-200 text-sm focus:outline-none focus:border-amber-500/50" />
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs block mb-1.5 font-medium">Target Database Node</label>
                      <input type="text" placeholder="District Record DB-02" value={targetNode} onChange={(e) => setTargetNode(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-200 text-sm focus:outline-none focus:border-amber-500/50" />
                    </div>
                  </div>
                  <div>
                    <label className="text-zinc-400 text-xs block mb-1.5 font-medium">UL PIN</label>
                    <input type="text" placeholder="PB-LDH-2026-984124" value={ulPin} onChange={(e) => setUlPin(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-200 text-sm focus:outline-none focus:border-amber-500/50" />
                  </div>
                  <div>
                    <label className="text-zinc-400 text-xs block mb-1.5 font-medium">Incomplete Documents (Comma separated)</label>
                    <input type="text" placeholder="Mutation Deed 2018, RoR Jamabandi Naksha" value={incompleteDocsInput} onChange={(e) => setIncompleteDocsInput(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-zinc-200 text-sm focus:outline-none focus:border-amber-500/50" />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-medium text-sm hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-sm hover:bg-white transition-all shadow-md"
                >
                  Dispatch Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= FIELD PROOF MODAL ================= */}
      {isFieldProofModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white">Field Proof & Signed Document Upload</h3>
              <button onClick={() => setIsFieldProofModalOpen(false)} className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <p className="text-zinc-400">Task: <span className="text-zinc-100 font-medium">{selectedTask.title}</span></p>
              
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium text-xs uppercase tracking-wider block">1. Field Measurement Snapshot</label>
                <input type="file" className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 bg-zinc-950 p-2 rounded-xl border border-zinc-800" />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium text-xs uppercase tracking-wider block">2. District Land Head Signed Document</label>
                <input type="file" className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 bg-zinc-950 p-2 rounded-xl border border-zinc-800" />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                onClick={() => setIsFieldProofModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleFieldSubmit(selectedTask.id)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 shadow-md"
              >
                Submit & Complete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}