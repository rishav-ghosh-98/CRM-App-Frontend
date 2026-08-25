import api from "./axios";
import { ENDPOINTS } from "./endpoints";

export const getLastWeekReport = () => api.get(ENDPOINTS.lastWeekReport);
export const getPipelineReport = () => api.get(ENDPOINTS.pipelineReport);
