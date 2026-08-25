import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import { getLeads } from "../api/leadApi";
import { getLastWeekReport } from "../api/reportApi";
import Loader from "../components/Loader";
import { FaArrowLeft } from "react-icons/fa";
import "./Reports.css";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];
const chartColors = ["#2563eb", "#0891b2", "#059669", "#d97706", "#64748b"];

const Reports = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [lastWeekLeads, setLastWeekLeads] = useState([]);
  const [error, setError] = useState("");
  const [lastWeekError, setLastWeekError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const leadsResponse = await getLeads();
        setLeads(leadsResponse.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch report data.");
      }

      try {
        const lastWeekResponse = await getLastWeekReport();
        setLastWeekLeads(
          (Array.isArray(lastWeekResponse.data) ? lastWeekResponse.data : []).map(
            (lead) => ({
              ...lead,
              id: lead.id || lead._id,
              salesAgent:
                typeof lead.salesAgent === "string"
                  ? lead.salesAgent
                  : lead.salesAgent?.name || null,
            }),
          ),
        );
      } catch (err) {
        setLastWeekError(
          err.response?.data?.error || "Failed to fetch last-week report.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const statusCounts = statuses.map(
    (status) => leads.filter((lead) => lead.status === status).length,
  );
  const closedLeads = leads.filter((lead) => lead.status === "Closed");
  const leadsByAgent = closedLeads.reduce((counts, lead) => {
    const agent = lead.salesAgent?.name || "Unassigned";
    counts[agent] = (counts[agent] || 0) + 1;
    return counts;
  }, {});

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { padding: 18, usePointStyle: true } },
    },
  };
  const barOptions = {
    ...chartOptions,
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  if (error) {
    return <div className="reports-page"><p className="empty-leads">{error}</p></div>;
  }
  if (loading) {
    return <div className="reports-page"><Loader /></div>;
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <button className="text-back-button" onClick={() => navigate("/")}>
          <FaArrowLeft />
          <span>Back to dashboard</span>
        </button>
        <p className="page-eyebrow">Analytics</p>
        <h1>Anvaya CRM Reports</h1>
        <p className="reports-subtitle">A clear view of your pipeline, team performance, and lead distribution.</p>
      </div>

      <div className="report-grid">
        <section className="report-card report-card-wide last-week-report">
          <div className="report-card-heading">
            <div>
              <p className="page-eyebrow">Recent wins</p>
              <h2>Leads closed in the last 7 days</h2>
            </div>
            <strong>{lastWeekLeads.length} closed</strong>
          </div>
          {lastWeekError ? (
            <p className="empty-leads">{lastWeekError}</p>
          ) : lastWeekLeads.length ? (
            <div className="last-week-list">
              {lastWeekLeads.map((lead) => (
                <div className="last-week-row" key={lead.id}>
                  <div>
                    <strong>{lead.name}</strong>
                    <span>{lead.salesAgent || "Unassigned"}</span>
                  </div>
                  <time dateTime={lead.closedAt}>
                    {new Date(lead.closedAt).toLocaleDateString()}
                  </time>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-leads">No leads were closed in the last 7 days.</p>
          )}
        </section>

        <section className="report-card report-card-wide">
          <div className="report-card-heading">
            <div>
              <p className="page-eyebrow">Pipeline overview</p>
              <h2>Closed and in pipeline</h2>
            </div>
            <strong>{leads.length} total leads</strong>
          </div>
          <div className="report-chart report-doughnut-chart">
            <Doughnut
              data={{
                labels: ["Closed", "In pipeline"],
                datasets: [{ data: [closedLeads.length, leads.length - closedLeads.length], backgroundColor: ["#059669", "#2563eb"], borderWidth: 0 }],
              }}
              options={chartOptions}
            />
          </div>
        </section>

        <section className="report-card">
          <div className="report-card-heading">
            <div>
              <p className="page-eyebrow">Team performance</p>
              <h2>Closed by sales agent</h2>
            </div>
          </div>
          <div className="report-chart">
            <Bar
              data={{
                labels: Object.keys(leadsByAgent),
                datasets: [{ label: "Closed leads", data: Object.values(leadsByAgent), backgroundColor: "#d97706", borderRadius: 6 }],
              }}
              options={barOptions}
            />
          </div>
        </section>

        <section className="report-card">
          <div className="report-card-heading">
            <div>
              <p className="page-eyebrow">Lead mix</p>
              <h2>Status distribution</h2>
            </div>
          </div>
          <div className="report-chart report-doughnut-chart">
            <Doughnut
              data={{
                labels: statuses,
                datasets: [{ data: statusCounts, backgroundColor: chartColors, borderWidth: 0 }],
              }}
              options={chartOptions}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Reports;
