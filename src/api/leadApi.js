import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const getLeads = () => api.get(ENDPOINTS.leads);