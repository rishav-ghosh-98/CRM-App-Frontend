import { useEffect } from "react";
import { getLeads } from "../api/leadApi";

const Leads = () => {
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getLeads();
        console.log("Leads API response:", response.data);
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      }
    };

    fetchLeads();
  }, []);

  return <div>Leads Page</div>;
};

export default Leads;
