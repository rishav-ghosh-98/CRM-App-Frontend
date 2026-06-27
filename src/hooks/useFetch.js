import { useState, useEffect } from "react";
import api from "../api/axios";
import { useLocation } from "react-router-dom";
const useFetch = (url, initialData) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    api.get(url)
      .then((res) => {
        setLoading(true);        
        setData(res.data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);       
      });
  }, [url ,location.pathname]);

  return { data, loading, error };
};

export default useFetch;