import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeads } from "../api/leadApi";
import "./Dashboard.css";
const Dashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getLeads();
        setLeads(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch lead.");
      }
    };
    fetchLeads();
  }, []);
  if (error) {
    return (
      <div className="leads-page">
        <p className="empty-leads">{error}</p>
      </div>
    );
  }
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
  const statusCounts = leads.reduce((counts, lead) => {
    counts[lead.status] = (counts[lead.status] || 0) + 1;
    return counts;
  }, {});
  const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];
  const maxStatusCount = Math.max(...statuses.map((status) => statusCounts[status] || 0), 1);
  const leadsByAgent = leads.reduce((counts, lead) => {
    const agentName = lead.salesAgent?.name || "Unassigned";
    counts[agentName] = (counts[agentName] || 0) + 1;
    return counts;
  }, {});
  const agentCounts = Object.entries(leadsByAgent);
  const maxAgentCount = Math.max(...agentCounts.map(([, count]) => count), 1);
  const lastWeek = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const closedLastWeek = leads.filter(
    (lead) => lead.closedAt && new Date(lead.closedAt).getTime() >= lastWeek,
  ).length;
  return (
    <>
      <h3 className="dashboard-title">Anvaya CRM Dashboard</h3>
      <div className="dashboard-overview">
        <div className="overview-card overview-blue">
          <span>Total leads</span>
          <strong>{leads.length}</strong>
          <small>All lead records</small>
        </div>
        <div className="overview-card overview-green">
          <span>Active leads</span>
          <strong>{leads.filter((lead) => lead.status !== "Closed").length}</strong>
          <small>Still in progress</small>
        </div>
        <div className="overview-card overview-orange">
          <span>Closed last week</span>
          <strong>{closedLastWeek}</strong>
          <small>Completed in 7 days</small>
        </div>
      </div>
      <div className="recent-leads">
        {recentLeads.map((lead) => (
          <button key={lead._id} onClick={() => navigate(`/leads/${lead._id}`)}>
            <strong>{lead.name}</strong>
            <span>{lead.status}</span>
            <span>{lead.salesAgent?.name || "Unassigned"}</span>
          </button>
        ))}
      </div>
      <div className="lead-status">
        <h3>Lead Status</h3>
        <div className="status-chart">
          {statuses.map((status) => {
            const count = statusCounts[status] || 0;
            return (
              <div className="status-chart-row" key={status}>
                <div className="status-chart-label">
                  <span>{status}</span>
                  <strong>{count}</strong>
                </div>
                <div className="status-chart-track">
                  <span className={`status-chart-bar status-bar-${status.toLowerCase().replaceAll(" ", "-")}`} style={{ width: `${(count / maxStatusCount) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="dashboard-agent-section">
        <h3>Leads by Sales Agent</h3>
        <div className="agent-chart">
          {agentCounts.map(([agentName, count]) => (
            <div className="agent-chart-row" key={agentName}>
              <div className="status-chart-label">
                <span>{agentName}</span>
                <strong>{count}</strong>
              </div>
              <div className="status-chart-track">
                <span className="agent-chart-bar" style={{ width: `${(count / maxAgentCount) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard-filters">
        <h3>Quick Filters</h3>
        <div className="dashboard-filter-actions">
          {statuses.slice(0, 3).map((status) => (
            <button className="dashboard-filter-button" key={status} onClick={() => navigate(`/leads?status=${encodeURIComponent(status)}`)}>
              {status}
            </button>
          ))}
          <button className="dashboard-add-button" onClick={() => navigate("/add-lead")}>Add New Lead</button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
