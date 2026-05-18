import React, { useState, useEffect } from 'react';
import api from '../api';

const Professors = () => {
  const [professors, setProfessors] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [school, setSchool] = useState('');
  const [institution, setInstitution] = useState('');
  const [email, setEmail] = useState('');

  const fetchProfessors = async () => {
    try {
      const res = await api.get('/professors');
      setProfessors(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfessors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/professors', { 
        first_name: firstName, 
        last_name: lastName, 
        school, 
        institution, 
        email 
      });
      setFirstName(''); setLastName(''); setSchool(''); setInstitution(''); setEmail('');
      fetchProfessors();
    } catch (error) {
      alert("Error adding professor.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Professors</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Professor</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input required type="text" placeholder="First Name" className="border p-2 rounded w-1/4" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <input required type="text" placeholder="Last Name" className="border p-2 rounded w-1/4" value={lastName} onChange={e => setLastName(e.target.value)} />
            <input type="email" placeholder="Email" className="border p-2 rounded w-2/4" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="flex gap-4">
            <input type="text" placeholder="School" className="border p-2 rounded w-1/2" value={school} onChange={e => setSchool(e.target.value)} />
            <input type="text" placeholder="Institution" className="border p-2 rounded w-1/2" value={institution} onChange={e => setInstitution(e.target.value)} />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 self-start mt-2">Add</button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">School / Institution</th>
            </tr>
          </thead>
          <tbody>
            {professors.map(p => (
              <tr key={p.professor_id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{p.professor_id}</td>
                <td className="px-6 py-4 font-medium">{p.first_name} {p.last_name}</td>
                <td className="px-6 py-4 text-xs">{p.email || '-'}</td>
                <td className="px-6 py-4 text-xs">
                  <div>{p.school || '-'}</div>
                  <div className="text-gray-500">{p.institution || '-'}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Professors;
