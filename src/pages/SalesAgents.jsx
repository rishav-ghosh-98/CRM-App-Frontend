import { useEffect, useState } from "react";
import { getSalesAgents } from "../api/salesAgentApi";
import "./SalesAgents.css";

const SalesAgents = () => {
  const [error, setError] = useState("");
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getAgents = async () => {
      try {
        const response = await getSalesAgents();
        setAgents(response.data?.agents || []);
        console.log(response.data?.agents);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch Sales agent.");
      } finally {
        setLoading(false);
      }
    };
    getAgents();
  }, []);
  if (error) {
    return (
      <div className="sales-agents-page">
        <p className="empty-leads">{error}</p>
      </div>
    );
  }
  return (
    <section className="sales-agents-page">
      <header className="sales-agents-header">
        <div>
          <p className="page-eyebrow">Team directory</p>
          <h1>Sales Agent Management</h1>
          <p className="page-subtitle">
            Keep track of your sales team and their contact details.
          </p>
        </div>
        <button className="add-agent-button" type="button" disabled>
          Add New Agent
        </button>
      </header>

      <div className="sales-agents-card">
        <div className="sales-agents-card-header">
          <div>
            <p className="sales-agents-kicker">Directory</p>
            <h2>Sales Agent List</h2>
          </div>
          <span className="agent-count">{agents?.length || 0} agents</span>
        </div>
        <div className="sales-agents-list" aria-live="polite">
          {loading ? (
            <p className="empty-leads">Loading sales agents...</p>
          ) : agents.length ? (
            agents.map((agent) => (
              <div key={agent.id}>
                <strong>{agent.name}</strong>
                <span>{agent.email}</span>
              </div>
            ))
          ) : (
            <p className="empty-leads">No sales agents found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SalesAgents;
