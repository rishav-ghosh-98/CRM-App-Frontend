import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getLeads } from "../api/leadApi";
import { getSalesAgents } from "../api/salesAgentApi";
import Loader from "../components/Loader";
import "./Leads.css";

const Leads = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(searchParams.get("salesAgent") || "");
  const [selectedSource, setSelectedSource] = useState(searchParams.get("source") || "");
  const [selectedTag, setSelectedTag] = useState(searchParams.get("tags") || "");
  const [sortBy, setSortBy] = useState("priority");
  const [loading, setLoading] = useState(true);
  const statusOptions = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
  ];
  const sourceOptions = [
    "Website",
    "Referral",
    "Cold Call",
    "Advertisement",
    "Email",
    "Other",
  ];
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get("status") || "");
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (loading) {
    return <div className="leads-page"><Loader /></div>;
  }
  const filteredLeads = leads.filter((lead) => {
    const matchesAgent =
      !selectedAgent || lead.salesAgent?._id === selectedAgent;

    const matchesStatus = !selectedStatus || lead.status === selectedStatus;
    const matchesSource = !selectedSource || lead.source === selectedSource;
    const matchesTag = !selectedTag || lead.tags?.includes(selectedTag);

    return matchesAgent && matchesStatus && matchesSource && matchesTag;
  });
  const tagOptions = [...new Set(leads.flatMap((lead) => lead.tags || []))].sort();
  const updateFilter = (name, value, setter) => {
    setter(value);
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(name, value);
    } else {
      nextParams.delete(name);
    }
    setSearchParams(nextParams);
  };
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
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedStatus(value);

                  updateFilter("status", value, setSelectedStatus);
                }}
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
                onChange={(e) => updateFilter("salesAgent", e.target.value, setSelectedAgent)}
              >
                <option value="">All agents</option>
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Lead Source{" "}
              <select
                value={selectedSource}
                onChange={(e) => updateFilter("source", e.target.value, setSelectedSource)}
              >
                <option value="">All sources</option>
                {sourceOptions.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </label>
            <label>
              Tags{" "}
              <select
                value={selectedTag}
                onChange={(e) => updateFilter("tags", e.target.value, setSelectedTag)}
              >
                <option value="">All tags</option>
                {tagOptions.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
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
                  <span className="lead-tags">
                    {lead.tags?.length ? lead.tags.map((tag) => (
                      <span className="lead-tag" key={tag}>{tag}</span>
                    )) : <span className="lead-tag-empty">No tags</span>}
                  </span>
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
