import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSalesAgents } from "../api/salesAgentApi";
import { createLead } from "../api/leadApi";
import "./AddLead.css";

const AddLead = () => {
  const navigate = useNavigate();
  const [salesAgents, setSalesAgents] = useState([]);
  const sources = [
    "Website",
    "Referral",
    "Cold Call",
    "Advertisement",
    "Email",
    "Other",
  ];
  const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];
  const priorities = ["High", "Medium", "Low"];
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "New",
    tags: "",
    timeToClose: "",
    priority: "Medium",
  });
  const [error, setError] = useState("");
  useEffect(() => {
    const getAgents = async () => {
      try {
        const response = await getSalesAgents();
        setSalesAgents(response.data?.agents);
      } catch (error) {
        setError(error.response?.data?.error || "Failed to fetch Agents.");
      }
    };
    getAgents();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const leadData = {
      name: formData.name,
      source: formData.source,
      ...(formData.salesAgent && { salesAgent: formData.salesAgent }),
      status: formData.status,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim()),
      priority: formData.priority,
      timeToClose: Number(formData.timeToClose),
    };
    try {
      await createLead(leadData);
      navigate("/leads");
    } catch (error) {
      setError(
        error.response?.data?.error || "Failed to create lead.",
      );
    }
  };
  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }
  if (!salesAgents) {
    return (
      <div>
        <p>Loading agents...</p>
      </div>
    );
  }
  return (
    <>
      <div>Add Lead Page</div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Lead Name</label>

            <input
              type="text"
              name="name"
              placeholder="Add Lead Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Lead Source: </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
            <label>Select Agent</label>
            <select
              name="salesAgent"
              value={formData.salesAgent}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              {salesAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
            <label>Lead Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              {statuses.map((stat) => (
                <option key={stat} value={stat}>
                  {stat}
                </option>
              ))}
            </select>
            <label>Lead Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              {priorities.map((prior) => (
                <option key={prior} value={prior}>
                  {prior}
                </option>
              ))}
            </select>
            <label>
              Tags
              <input
                type="text"
                placeholder="e.g. hot, enterprise, follow-up"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
              />
            </label>
            <label>
              Time to close
              <input
                type="number"
                placeholder="Enter days to close"
                name="timeToClose"
                value={formData.timeToClose}
                onChange={handleChange}
                min="1"
              />
            </label>
          </div>
          <button type="submit">Create Lead</button>
        </form>
      </div>
    </>
  );
};

export default AddLead;
