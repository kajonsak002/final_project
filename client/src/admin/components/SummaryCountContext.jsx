import React, { createContext, useContext, useState, useCallback } from "react";

const SummaryCountContext = createContext();

export const useSummaryCount = () => useContext(SummaryCountContext);

export const SummaryCountProvider = ({ children }) => {
  const [summaryCount, setSummaryCount] = useState({});

  const fetchSummary = useCallback(() => {
    fetch(import.meta.env.VITE_URL_API + "get_summary")
      .then((res) => res.json())
      .then((data) => setSummaryCount(data))
      .catch(() => setSummaryCount({}));
  }, []);

  React.useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <SummaryCountContext.Provider value={{ summaryCount, fetchSummary }}>
      {children}
    </SummaryCountContext.Provider>
  );
};
