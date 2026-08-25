import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Dashboard from "../pages/Dashboard";
import LeadManagement from "../pages/LeadManagement.";
import Leads from "../pages/Leads";
import AddLead from "../pages/AddLead";
import SalesAgents from "../pages/SalesAgents";
import Reports from "../pages/Reports";
import EditLeads from "../components/EditLeads";
import AddSalesAgent from "../pages/AddSalesAgent";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="leads/:id" element={<LeadManagement />} />
          <Route path="leads/:id/edit" element={<EditLeads />} />
          <Route path="add-lead" element={<AddLead />} />
          <Route path="agents" element={<SalesAgents />} />
          <Route path="reports" element={<Reports />} />
          <Route path ="add-agents" element = {< AddSalesAgent/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;