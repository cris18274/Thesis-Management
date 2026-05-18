import React, { useState, useEffect } from 'react';
import api from '../api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [institution, setInstitution] = useState('');
  
  const [completedCurriculum, setCompletedCurriculum] = useState(false);
  const [clearedLibrary, setClearedLibrary] = useState(false);
  const [clearedLaboratory, setClearedLaboratory] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students', { 
        first_name: firstName, 
        last_name: lastName, 
        email, 
        phone, 
        school, 
        institution,
        completed_curriculum: completedCurriculum,
        cleared_library: clearedLibrary,
        cleared_laboratory: clearedLaboratory
      });
      setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setSchool(''); setInstitution('');
      setCompletedCurriculum(false); setClearedLibrary(false); setClearedLaboratory(false);
      fetchStudents();
    } catch (error) {
      alert("Error adding student. Email might be duplicate.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure?")) {
      try {
        await api.delete(`/students/${id}`);
        fetchStudents();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Students</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Student</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input required type="text" placeholder="First Name" className="border p-2 rounded w-1/4" value={firstName} onChange={e => setFirstName(e.target.value)} />
            <input required type="text" placeholder="Last Name" className="border p-2 rounded w-1/4" value={lastName} onChange={e => setLastName(e.target.value)} />
            <input required type="email" placeholder="Email" className="border p-2 rounded w-1/4" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="text" placeholder="Phone" className="border p-2 rounded w-1/4" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="flex gap-4">
            <input type="text" placeholder="School" className="border p-2 rounded w-1/2" value={school} onChange={e => setSchool(e.target.value)} />
            <input type="text" placeholder="Institution" className="border p-2 rounded w-1/2" value={institution} onChange={e => setInstitution(e.target.value)} />
          </div>
          <div className="flex gap-4 items-center mt-2">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={completedCurriculum} onChange={e => setCompletedCurriculum(e.target.checked)} /> Completed Curriculum
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={clearedLibrary} onChange={e => setClearedLibrary(e.target.checked)} /> Cleared Library
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={clearedLaboratory} onChange={e => setClearedLaboratory(e.target.checked)} /> Cleared Laboratory
            </label>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 self-start mt-2">Add</button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">School / Institution</th>
              <th className="px-6 py-3">Contact</th>
              <th className="px-6 py-3">Checks</th>
              <th className="px-6 py-3">Has Thesis</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.student_id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{s.student_id}</td>
                <td className="px-6 py-4 font-medium">{s.first_name} {s.last_name}</td>
                <td className="px-6 py-4 text-xs">
                  <div>{s.school || '-'}</div>
                  <div className="text-gray-500">{s.institution || '-'}</div>
                </td>
                <td className="px-6 py-4 text-xs">
                  <div>{s.email}</div>
                  <div className="text-gray-500">{s.phone}</div>
                </td>
                <td className="px-6 py-4 text-xs">
                  <div className={s.completed_curriculum ? 'text-green-600' : 'text-red-500'}>Curriculum: {s.completed_curriculum ? 'Yes' : 'No'}</div>
                  <div className={s.cleared_library ? 'text-green-600' : 'text-red-500'}>Library: {s.cleared_library ? 'Yes' : 'No'}</div>
                  <div className={s.cleared_laboratory ? 'text-green-600' : 'text-red-500'}>Lab: {s.cleared_laboratory ? 'Yes' : 'No'}</div>
                </td>
                <td className="px-6 py-4">{s.has_thesis ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(s.student_id)} className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
