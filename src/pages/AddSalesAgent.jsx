import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createSalesAgent } from "../api/salesAgentApi";
import "./AddSalesAgent.css";

const AddSalesAgent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setFieldErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const agentData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
    };
    const nextFieldErrors = {
      name: agentData.name ? "" : "Agent name is required.",
      email: agentData.email ? "" : "Agent email is required.",
    };

    if (nextFieldErrors.name || nextFieldErrors.email) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await createSalesAgent(agentData);
      navigate("/agents");
    } catch (error) {
      setError(
        error.response?.data?.error || "Failed to create sales agent.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="add-agent-page">
      <button
        className="add-agent-back-button"
        type="button"
        onClick={() => navigate("/agents")}
      >
        Back to Sales Agents
      </button>
      <p className="page-eyebrow">Team directory</p>
      <h1>Add Sales Agent</h1>
      <p className="page-subtitle">Add a name and email address for a new team member.</p>

      <form className="add-agent-form" onSubmit={handleSubmit}>
        <div className="add-agent-form-fields">
          <label className={fieldErrors.name ? "has-error" : ""} htmlFor="agent-name">
            Agent Name
            <input
              id="agent-name"
              type="text"
              name="name"
              placeholder="Add agent name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "agent-name-error" : undefined}
            />
            {fieldErrors.name && <span className="add-agent-field-error" id="agent-name-error">{fieldErrors.name}</span>}
          </label>
          <label className={fieldErrors.email ? "has-error" : ""} htmlFor="agent-email">
            Agent Email
            <input
              id="agent-email"
              type="email"
              name="email"
              placeholder="Add agent email address"
              value={formData.email}
              onChange={handleChange}
              required
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "agent-email-error" : undefined}
            />
            {fieldErrors.email && <span className="add-agent-field-error" id="agent-email-error">{fieldErrors.email}</span>}
          </label>
        </div>

        {error && <p className="add-agent-error" role="alert">{error}</p>}

        <div className="add-agent-form-actions">
          <button
            className="add-agent-cancel-button"
            type="button"
            onClick={() => navigate("/agents")}
          >
            Cancel
          </button>
          <button className="add-agent-submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding Agent..." : "Add Agent"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddSalesAgent;
