import React, { useState, useEffect } from 'react';
import api from '../api';

const SCHOOLS = [
  "All",
  "School of Mathematical and Computational Sciences",
  "School of Earth, Energy, and Environmental Sciences",
  "School of Physical Sciences and Nanotechnology",
  "School of Biological Sciences and Engineering",
  "School of Chemical Sciences and Engineering",
  "School of Agricultural and Agro-industrial Sciences"
];

const ThesisCard = ({ thesis, professors, fetchData, activeTab }) => {
  const [tutorId, setTutorId] = useState('');
  const [tutorRole, setTutorRole] = useState('Tutor');

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this thesis?")) {
      try {
        await api.delete(`/theses/${thesis.thesis_id}`);
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAssignTutor = async (e) => {
    e.preventDefault();
    if (!tutorId) return;
    try {
      await api.post(`/theses/${thesis.thesis_id}/tutors`, { professor_id: tutorId, role: tutorRole });
      setTutorId('');
      fetchData();
    } catch (error) {
      alert("Error assigning tutor: " + (error.response?.data?.error || error.message));
    }
  };

  const handlePromote = async (stage) => {
    try {
      await api.put(`/theses/${thesis.thesis_id}`, { stage });
      fetchData();
    } catch (error) {
      alert("Error promoting thesis.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-400 flex flex-col h-full">
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg mb-1">{thesis.title}</h3>
          <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">{thesis.custom_id}</span>
        </div>
        <p className="text-xs text-gray-500 italic mb-2 line-clamp-3">{thesis.abstract}</p>
        <p className="text-sm text-gray-600 mb-1">Student: <span className="font-semibold">{thesis.student_name}</span></p>
        <p className="text-xs text-gray-500 mb-4">{thesis.student_school || 'No School'}</p>
        
        {activeTab === 'Thesis I' && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 border-b pb-1 mb-2">Tutors</h4>
            {thesis.tutors?.length > 0 ? (
              <ul className="text-xs text-gray-600 mb-2 list-disc list-inside">
                {thesis.tutors.map((t, idx) => <li key={idx}>{t.name} ({t.role})</li>)}
              </ul>
            ) : <p className="text-xs text-gray-400 italic mb-2">No tutors assigned</p>}
            
            <form onSubmit={handleAssignTutor} className="flex gap-2 text-xs">
              <select className="border p-1 rounded flex-grow" value={tutorId} onChange={e => setTutorId(e.target.value)}>
                <option value="">-- Select Prof --</option>
                {professors.map(p => <option key={p.professor_id} value={p.professor_id}>{p.first_name} {p.last_name}</option>)}
              </select>
              <select className="border p-1 rounded w-20" value={tutorRole} onChange={e => setTutorRole(e.target.value)}>
                <option value="Tutor">Tutor</option>
                <option value="Co-Tutor">Co-Tutor</option>
              </select>
              <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Add</button>
            </form>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800`}>
          {thesis.stage}
        </span>
        <div className="flex gap-2">
          {activeTab === 'Thesis I' && (
            <button onClick={() => handlePromote('Thesis II')} className="text-sm bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Pass to Thesis II</button>
          )}
          {activeTab === 'Thesis II' && (
            <button onClick={() => handlePromote('Defense')} className="text-sm bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600">Send to Defense</button>
          )}
          <button onClick={handleDelete} className="text-sm text-red-500 hover:text-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
};

const Theses = () => {
  const [theses, setTheses] = useState([]);
  const [students, setStudents] = useState([]);
  const [professors, setProfessors] = useState([]);
  
  const [activeTab, setActiveTab] = useState('Thesis I');
  const [selectedSchool, setSelectedSchool] = useState('All');

  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [studentId, setStudentId] = useState('');

  const fetchData = async () => {
    try {
      const [tRes, sRes, pRes] = await Promise.all([
        api.get('/theses'), 
        api.get('/students'),
        api.get('/professors')
      ]);
      setTheses(tRes.data);
      setStudents(sRes.data.filter(s => !s.has_thesis));
      setProfessors(pRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) return alert("Please select a student");
    try {
      await api.post('/theses', { title, abstract, student_id: studentId });
      setTitle(''); setAbstract(''); setStudentId('');
      fetchData();
    } catch (error) {
      alert("Error creating thesis.");
    }
  };

  const filteredTheses = theses.filter(t => {
    if (t.stage !== activeTab) return false;
    if (selectedSchool !== 'All' && t.student_school !== selectedSchool) return false;
    return true;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Thesis Dashboard</h1>
      
      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button 
          className={`py-2 px-4 font-semibold ${activeTab === 'Thesis I' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('Thesis I')}
        >
          Thesis I
        </button>
        <button 
          className={`py-2 px-4 font-semibold ${activeTab === 'Thesis II' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('Thesis II')}
        >
          Thesis II
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold text-gray-700">Filter by School:</label>
          <select 
            className="border p-2 rounded text-sm w-64"
            value={selectedSchool}
            onChange={e => setSelectedSchool(e.target.value)}
          >
            {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {activeTab === 'Thesis I' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-4">Register New Thesis</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <input required type="text" placeholder="Thesis Title" className="border p-2 rounded flex-grow" value={title} onChange={e => setTitle(e.target.value)} />
              <select required className="border p-2 rounded w-1/3" value={studentId} onChange={e => setStudentId(e.target.value)}>
                <option value="">-- Select Student --</option>
                {students.map(s => (
                  <option key={s.student_id} value={s.student_id}>{s.first_name} {s.last_name} ({s.student_id})</option>
                ))}
              </select>
            </div>
            <textarea placeholder="Abstract" className="border p-2 rounded w-full h-20" value={abstract} onChange={e => setAbstract(e.target.value)}></textarea>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 self-start">Create Thesis I</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTheses.length === 0 ? (
          <p className="text-gray-500 italic">No theses found for this filter.</p>
        ) : (
          filteredTheses.map(t => (
            <ThesisCard key={t.thesis_id} thesis={t} professors={professors} fetchData={fetchData} activeTab={activeTab} />
          ))
        )}
      </div>
    </div>
  );
};

export default Theses;
