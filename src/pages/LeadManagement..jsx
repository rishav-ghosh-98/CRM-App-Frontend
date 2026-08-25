import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLeadsById } from "../api/leadApi";
import { FaArrowLeft } from "react-icons/fa";
import Loader from "../components/Loader";
import "./Leads.css";

const LeadManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getLeadsById(id);
        setLead(response.data.lead);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch lead.");
      }
    };

    fetchLeads();
  }, [id]);

  if (error) {
    return <div className="leads-page"><p className="empty-leads">{error}</p></div>;
  }

  if (!lead) {
    return <div className="leads-page"><Loader /></div>;
  }

  return (
    <div className="leads-page lead-management-page">
      <div className="lead-management-header">
        <div>
          <button className="text-back-button" onClick={() => navigate("/leads")}>
            <FaArrowLeft />
            <span>Back to leads</span>
          </button>
          <p className="page-eyebrow">Lead record</p>
          <h1>{lead.name}</h1>
          <p className="page-subtitle">Review the latest details and ownership for this lead.</p>
        </div>
        <div className="lead-header-actions">
          <span className={`status status-${lead.status.toLowerCase().replaceAll(" ", "-")}`}>{lead.status}</span>
          <button className="edit-button" type="button" onClick={() => navigate(`/leads/${id}/edit`)}>Edit details</button>
        </div>
      </div>

      <div className="lead-detail-layout">
        <section className="lead-details-card" aria-label="Lead details">
          <div className="detail-card-heading">
            <div>
              <p className="page-eyebrow">Overview</p>
              <h2>Lead details</h2>
            </div>
            <span className="lead-id">ID: {lead._id.slice(-8)}</span>
          </div>

          <div className="detail-grid">
            <div className="detail-item info-group">
              <span className="detail-label">Lead name</span>
              <span className="detail-value">{lead.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Sales agent</span>
              <span className="detail-value">{lead.salesAgent?.name || "Unassigned"}</span>
              {lead.salesAgent?.email && <span className="detail-hint">{lead.salesAgent.email}</span>}
            </div>
            <div className="detail-item">
              <span className="detail-label">Lead source</span>
              <span className="detail-value">{lead.source}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Lead status</span>
              <span className={`detail-value status-text status-${lead.status.toLowerCase().replaceAll(" ", "-")}`}>{lead.status}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Priority</span>
              <span className={`detail-value priority-${lead.priority.toLowerCase()}`}>{lead.priority}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time to close</span>
              <span className="detail-value">{lead.timeToClose} days</span>
            </div>
          </div>

          <div className="detail-footer">
            <button className="secondary-button" type="button" onClick={() => navigate("/leads")}>Return to lead list</button>
            <button className="edit-button" type="button" onClick={() => navigate(`/leads/${id}/edit`)}>Edit details</button>
          </div>
        </section>

        <aside className="lead-side-panel">
          <div className="side-panel-icon"><FaArrowLeft /></div>
          <h2>Keep the record moving</h2>
          <p>Make sure this lead has an owner and a clear next step.</p>
          <button className="back-button" onClick={() => navigate("/")}>Back to dashboard</button>
        </aside>
      </div>
    </div>
  );
};

export default LeadManagement;
