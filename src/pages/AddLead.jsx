import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSalesAgents } from "../api/salesAgentApi";
import { createLead } from "../api/leadApi";
import "./AddLead.css";

const AddLead = () => {
  const [salesAgents, setSalesAgents] = useState([]);
  const sources = [
    "Website",
    "Referral",
    "Cold Call",
    "Advertisement",
    "Email",
    "Other",
  ];
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
        setSalesAgents(response.data);
        console.log(response.data);
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
        <form>
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
          </div>
        </form>
      </div>
    </>
  );
};

export default AddLead;
