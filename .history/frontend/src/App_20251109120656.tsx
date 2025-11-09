import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import DailyEntries from './pages/DailyEntry';
import Employees from "./pages/Employees";
import Products from "./pages/Products";
import Settings from "./pages/Settings";
import Challans from "./pages/Challans";
import Reports from "./pages/Reports";



const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="entries" element={<DailyEntry />} />
          <Route path="products" element={<Products />} />
          <Route path="employees" element={<Employees />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="challans" element={<Challans />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
