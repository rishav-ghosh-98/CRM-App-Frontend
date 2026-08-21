import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const getLeads = () => api.get(ENDPOINTS.leads);
export const getLeadsById = (id) => api.get(ENDPOINTS.leadsById(id));
export const updateLead = (id, lead) => api.put(ENDPOINTS.leadsById(id), lead);
export const createLead = (lead) => api.post(ENDPOINTS.leads, lead);