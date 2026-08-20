import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const getSalesAgents = () => api.get(ENDPOINTS.agents);
export const createSalesAgent = (agent) => api.post(ENDPOINTS.agents, agent);
