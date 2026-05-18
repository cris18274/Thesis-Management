import React, { useState, useEffect } from 'react';
import api from '../api';

const DefenseCard = ({ thesis, professors, fetchData }) => {
  // Defense scheduling state
  const [date, setDate] = useState(thesis.defense ? thesis.defense.date : '');
  const [time, setTime] = useState(thesis.defense ? thesis.defense.time : '');
  const [location, setLocation] = useState(thesis.defense ? thesis.defense.location : '');
  const [modality, setModality] = useState(thesis.defense ? thesis.defense.modality : 'In-person');

  // Reviewer assignment state
  const [reviewerId, setReviewerId] = useState('');
  const [reviewerRole, setReviewerRole] = useState('Committee');

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      if (thesis.defense) {
        await api.put(`/defenses/${thesis.defense.defense_id}`, { date, time, location, modality });
      } else {
        await api.post('/defenses', { thesis_id: thesis.thesis_id, date, time, location, modality });
      }
      fetchData();
    } catch (error) {
      alert("Error scheduling defense.");
    }
  };

  const handleAssignReviewer = async (e) => {
    e.preventDefault();
    if (!reviewerId) return;
    try {
      await api.post(`/theses/${thesis.thesis_id}/reviewers`, { professor_id: reviewerId, role: reviewerRole });
      setReviewerId('');
      fetchData();
    } catch (error) {
      alert("Error assigning reviewer.");
    }
  };

  const handleUpdateReviewer = async (profId, currentRole, newComments, newRevisionCorrected) => {
    try {
      await api.put(`/theses/${thesis.thesis_id}/reviewers/${profId}`, { 
        role: currentRole, 
        comments: newComments, 
        revision_corrected: newRevisionCorrected 
      });
      fetchData();
    } catch (error) {
      alert("Error updating reviewer.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500 mb-6 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <h3 className="font-bold text-xl mb-1">{thesis.title}</h3>
        <p className="text-sm text-gray-600 mb-4">Student: <span className="font-semibold">{thesis.student_name}</span></p>

        <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Schedule Defense</h4>
        <form onSubmit={handleSchedule} className="flex flex-col gap-2 mb-4">
          <div className="flex gap-2">
            <input type="date" className="border p-2 rounded text-sm flex-1" value={date} onChange={e => setDate(e.target.value)} required />
            <input type="time" className="border p-2 rounded text-sm w-32" value={time} onChange={e => setTime(e.target.value)} required />
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Location" className="border p-2 rounded text-sm flex-1" value={location} onChange={e => setLocation(e.target.value)} required />
            <select className="border p-2 rounded text-sm w-32" value={modality} onChange={e => setModality(e.target.value)}>
              <option value="In-person">In-person</option>
              <option value="Virtual">Virtual</option>
            </select>
          </div>
          <button type="submit" className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 text-sm self-start">
            {thesis.defense ? 'Update Schedule' : 'Schedule'}
          </button>
        </form>
      </div>

      <div className="flex-1 border-l pl-6">
        <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">Final Reviewers</h4>
        
        <form onSubmit={handleAssignReviewer} className="flex gap-2 text-xs mb-4">
          <select className="border p-1 rounded flex-grow" value={reviewerId} onChange={e => setReviewerId(e.target.value)}>
            <option value="">-- Add Reviewer --</option>
            {professors.map(p => <option key={p.professor_id} value={p.professor_id}>{p.first_name} {p.last_name}</option>)}
          </select>
          <select className="border p-1 rounded" value={reviewerRole} onChange={e => setReviewerRole(e.target.value)}>
            <option value="Committee">Committee</option>
            <option value="President">President</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Add</button>
        </form>

        <div className="flex flex-col gap-3">
          {thesis.reviewers?.map(r => (
            <div key={r.professor_id} className="bg-gray-50 p-2 rounded text-sm border">
              <div className="font-semibold flex justify-between">
                <span>{r.name}</span>
                <span className="text-xs bg-gray-200 px-1 rounded">{r.role}</span>
              </div>
              <textarea 
                className="w-full border p-1 rounded mt-1 text-xs h-12" 
                placeholder="Reviewer Comments" 
                defaultValue={r.comments || ''}
                onBlur={e => handleUpdateReviewer(r.professor_id, r.role, e.target.value, r.revision_corrected)}
              ></textarea>
              <label className="flex items-center gap-2 mt-1 text-xs">
                <input 
                  type="checkbox" 
                  checked={r.revision_corrected || false} 
                  onChange={e => handleUpdateReviewer(r.professor_id, r.role, r.comments, e.target.checked)} 
                /> 
                Revision Corrections Made
              </label>
            </div>
          ))}
          {(!thesis.reviewers || thesis.reviewers.length === 0) && <p className="text-xs text-gray-400 italic">No reviewers assigned.</p>}
        </div>
      </div>
    </div>
  );
};

const Defenses = () => {
  const [theses, setTheses] = useState([]);
  const [professors, setProfessors] = useState([]);

  const fetchData = async () => {
    try {
      const [tRes, pRes] = await Promise.all([
        api.get('/theses'),
        api.get('/professors')
      ]);
      // Only show theses in the "Defense" stage
      setTheses(tRes.data.filter(t => t.stage === 'Defense'));
      setProfessors(pRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Defense Dashboard</h1>
      
      {theses.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
          No theses are currently in the Defense stage. Pass a thesis from Thesis II to Defense to see it here.
        </div>
      ) : (
        theses.map(t => (
          <DefenseCard key={t.thesis_id} thesis={t} professors={professors} fetchData={fetchData} />
        ))
      )}
    </div>
  );
};

export default Defenses;
