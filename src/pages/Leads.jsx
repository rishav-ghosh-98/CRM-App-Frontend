import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeads } from "../api/leadApi";
import { FaArrowLeft } from "react-icons/fa";
import "./Leads.css";

const Leads = () => {
 const navigate = useNavigate();
 const [leads, setLeads] = useState([]);
 useEffect(() => {
    const fetchLeads = async() => {
        try{
             const response = await getLeads();
        setLeads(response.data);
        }catch(err){
            console.error("Failed to fetch leads:", err);
        }
    }
    fetchLeads();
 },[])
 return (
    <div className="leads-page">
      <div className="lead-management-header">
        <h1>Lead Overview</h1>
        <button className="add-lead-button" onClick={() => navigate("/add-lead")}>Add New Lead</button>
      </div>
      <div className="lead-layout">
        <aside className="lead-sidebar">
          <button className="back-button" onClick={() => navigate("/")}>
            <FaArrowLeft className="back-arrow" />
            <span>Back to Dashboard</span>
          </button>
        </aside>
        <section className="lead-details-card" aria-label="Lead list">
          <div className="lead-controls">
            <label>Status <select defaultValue=""><option value="">All statuses</option><option>New</option><option>Qualified</option><option>Proposal Sent</option></select></label>
            <label>Sales Agent <select defaultValue=""><option value="">All agents</option></select></label>
            <label>Sort by <select defaultValue="priority"><option value="priority">Priority</option><option value="timeToClose">Time to Close</option></select></label>
          </div>
          <div className="lead-list">
            {leads.length ? leads.map((lead) => (
              <button className="lead-row" key={lead._id} onClick={() => navigate(`/leads/${lead._id}`)}>
                <strong>{lead.name}</strong>
                <span className={`status status-${lead.status.toLowerCase().replaceAll(" ", "-")}`}>{lead.status}</span>
                <span>{lead.salesAgent?.name || "Unassigned"}</span>
              </button>
            )) : <p className="empty-leads">No leads found.</p>}
          </div>
        </section>
        </div>
      </div>
 )
}
export default Leads;