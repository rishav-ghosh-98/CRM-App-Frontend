import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { getLeads } from "../api/leadApi";
import { FaArrowLeft } from "react-icons/fa";
import "./Leads.css";

const LeadManagement = () => {
  const navigate = useNavigate();
  // const [ leads,setLeads] = useState([]);
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getLeads();
        console.log("Leads API response:", response.data);
        setLeads(response.data)
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      }
    };

    fetchLeads();
  }, []);

  const lead = {
    name: "Lead Name",
    salesAgent: "John Doe",
    source: "Referral",
    status: "New",
    priority: "High",
    timeToClose: "30 Days",
  };

  return (
    <div className="leads-page">
      <div className="leads-shell">
        <div className="lead-management-header">
          <h1>Lead Management: {lead.name}</h1>
        </div>

        <div className="lead-layout">
          <aside className="lead-sidebar">
            <button className="back-button" onClick={() => navigate("/")}>
              <FaArrowLeft className="back-arrow" />
              <span>Back to Dashboard</span>
            </button>
          </aside>

          <section className="lead-details-card" aria-label="Lead details">
            <div className="detail-grid">
              <div className="detail-item info-group">
                <span className="detail-label">Lead Name</span>
                <span className="detail-value">{lead.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sales Agent</span>
                <span className="detail-value">{lead.salesAgent}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Lead Source</span>
                <span className="detail-value">{lead.source}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Lead Status</span>
                <span className="detail-value">{lead.status}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Priority</span>
                <span className="detail-value">{lead.priority}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Time to Close</span>
                <span className="detail-value">{lead.timeToClose}</span>
              </div>
            </div>

            <div className="details-footer">
              <button className="edit-button" type="button">
                Edit Lead Details
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LeadManagement;
