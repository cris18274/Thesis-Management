import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './Dashboard';
import Students from './pages/Students';
import Professors from './pages/Professors';
import Theses from './pages/Theses';
import Defenses from './pages/Defenses';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="professors" element={<Professors />} />
          <Route path="theses" element={<Theses />} />
          <Route path="defenses" element={<Defenses />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;