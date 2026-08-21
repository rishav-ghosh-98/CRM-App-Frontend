import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeads } from "../api/leadApi";
import { getSalesAgents } from "../api/salesAgentApi";
import "./Leads.css";

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [sortBy, setSortBy] = useState("priority");
  const statusOptions = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
  ];
  const [selectedStatus, setSelectedStatus] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsResponse, agentsResponse] = await Promise.all([
          getLeads(),
          getSalesAgents(),
        ]);

        setLeads(leadsResponse.data);
        setAgents(agentsResponse.data.agents);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);
  const filteredLeads = leads.filter((lead) => {
    const matchesAgent =
      !selectedAgent || lead.salesAgent?._id === selectedAgent;

    const matchesStatus = !selectedStatus || lead.status === selectedStatus;

    return matchesAgent && matchesStatus;
  });
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    if (sortBy === "timeToClose") {
      return Number(a.timeToClose) - Number(b.timeToClose);
    }

    return 0;
  });
  return (
    <div className="leads-page">
      <div className="lead-management-header">
        <div>
          <button
            className="text-back-button list-back-button"
            onClick={() => navigate("/")}
          >
            <span aria-hidden="true">←</span>
            <span>Back to dashboard</span>
          </button>
          <h1>Lead Overview</h1>
        </div>
        <button
          className="add-lead-button"
          onClick={() => navigate("/add-lead")}
        >
          Add New Lead
        </button>
      </div>
      <div className="lead-layout">
        <section className="lead-details-card" aria-label="Lead list">
          <div className="lead-controls">
            <label>
              Status{" "}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All statuses</option>
                {statusOptions.map((stat) => (
                  <option key={stat} value={stat}>
                    {stat}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Sales Agent{" "}
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
              >
                <option value="">All agents</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Sort by{" "}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="priority">Priority</option>
                <option value="timeToClose">Time to Close</option>
              </select>
            </label>
          </div>
          <div className="lead-list">
            {sortedLeads.length ? (
              sortedLeads.map((lead) => (
                <button
                  className="lead-row"
                  key={lead._id}
                  onClick={() => navigate(`/leads/${lead._id}`)}
                >
                  <strong>{lead.name}</strong>
                  <span
                    className={`status status-${lead.status.toLowerCase().replaceAll(" ", "-")}`}
                  >
                    {lead.status}
                  </span>
                  <span>{lead.salesAgent?.name || "Unassigned"}</span>
                </button>
              ))
            ) : (
              <p className="empty-leads">No leads found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
export default Leads;
