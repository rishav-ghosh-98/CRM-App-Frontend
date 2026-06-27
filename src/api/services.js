import api from "./axios"
import { ENDPOINTS } from "./endpoints"
// get leads

export const getLeads = ()=> api.get(ENDPOINTS.leads);