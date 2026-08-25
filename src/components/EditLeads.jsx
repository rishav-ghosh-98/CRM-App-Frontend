import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLeadsById, updateLead } from "../api/leadApi";
import { createSalesAgent, getSalesAgents } from "../api/salesAgentApi";
import { FaArrowLeft } from "react-icons/fa";
import Loader from "./Loader";

const emptyForm = {
  name: "",
  source: "Website",
  salesAgentName: "",
  salesAgentEmail: "",
  status: "New",
  tags: "",
  timeToClose: "",
  priority: "Medium",
};

const options = {
  source: ["Website", "Referral", "Cold Call", "Advertisement", "Email", "Other"],
  status: ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"],
  priority: ["High", "Medium", "Low"],
};

const fields = [
  { name: "name", label: "Lead name", wide: true, required: true },
  { name: "source", label: "Lead source", type: "select", required: true },
  { name: "status", label: "Lead status", type: "select", required: true },
  { name: "priority", label: "Priority", type: "select", required: true },
  { name: "timeToClose", label: "Time to close (days)", type: "number", required: true },
  { name: "salesAgentName", label: "Sales agent name", placeholder: "Leave blank to unassign" },
  { name: "salesAgentEmail", label: "Sales agent email", type: "email" },
  { name: "tags", label: "Tags", wide: true, placeholder: "Separate tags with commas" },
];

const toForm = (lead) => ({
  name: lead.name || "",
  source: lead.source || "Website",
  salesAgentName: lead.salesAgent?.name || "",
  salesAgentEmail: lead.salesAgent?.email || "",
  status: lead.status || "New",
  tags: Array.isArray(lead.tags) ? lead.tags.join(", ") : "",
  timeToClose: lead.timeToClose || "",
  priority: lead.priority || "Medium",
});

const EditLeads = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(emptyForm);
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const [leadResponse, agentsResponse] = await Promise.all([
          getLeadsById(id),
          getSalesAgents(),
        ]);
        setForm(toForm(leadResponse.data.lead));
        setAgents(agentsResponse.data.agents || []);
      } catch (err) {
        setLoadError(err.response?.data?.error || "Failed to fetch lead.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleChange = ({ target }) => {
    setForm((currentForm) => ({ ...currentForm, [target.name]: target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const agentName = form.salesAgentName.trim();
      const agentEmail = form.salesAgentEmail.trim().toLowerCase();
      if ((agentName && !agentEmail) || (!agentName && agentEmail)) {
        throw new Error("Enter both the sales agent name and email, or leave both blank.");
      }

      let salesAgent = null;
      if (agentName && agentEmail) {
        const existingAgent = agents.find(
          (agent) => agent.email.toLowerCase() === agentEmail,
        );
        if (existingAgent) {
          salesAgent = existingAgent.id;
        } else {
          const response = await createSalesAgent({ name: agentName, email: agentEmail });
          salesAgent = response.data.id;
        }
      }

      await updateLead(id, {
        name: form.name.trim(),
        source: form.source,
        status: form.status,
        priority: form.priority,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        timeToClose: Number(form.timeToClose),
        salesAgent,
      });
      navigate(`/leads/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to update lead.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="leads-page"><Loader /></div>;
  }

  if (loadError) {
    return <div className="leads-page"><p className="empty-leads">{loadError}</p></div>;
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
          <h1>Edit lead</h1>
          <p className="page-subtitle">Update the lead details and save your changes.</p>
        </div>
      </div>

      <form className="lead-details-card edit-lead-form" onSubmit={handleSubmit}>
        <div className="detail-card-heading">
          <div>
            <p className="page-eyebrow">Overview</p>
            <h2>Lead details</h2>
          </div>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="edit-form-grid">
          {fields.map(({ name, label, type = "text", wide, required, placeholder }) => (
            <label className={`edit-field${wide ? " edit-field-wide" : ""}`} key={name}>
              {label}
              {type === "select" ? (
                <select name={name} value={form[name]} onChange={handleChange} required={required}>
                  {options[name].map((option) => <option key={option}>{option}</option>)}
                </select>
              ) : (
                <input name={name} type={type} min={type === "number" ? 1 : undefined} value={form[name]} onChange={handleChange} placeholder={placeholder} required={required} />
              )}
            </label>
          ))}
        </div>

        <div className="detail-footer">
          <button className="secondary-button" type="button" onClick={() => navigate(`/leads/${id}`)}>Cancel</button>
          <button className="edit-button" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLeads;
