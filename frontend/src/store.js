import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState([]);

  useEffect(() => {
    const a = localStorage.getItem("answers");
    const r = localStorage.getItem("results");

    if (a) setAnswers(JSON.parse(a));
    if (r) setResults(JSON.parse(r));
  }, []);

  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  const saveAnswer = (examCode, data) => {
    setAnswers(prev => ({
      ...prev,
      [examCode]: data
    }));
  };

  const addResult = (result) => {
    setResults(prev => [...prev, result]);
  };

  return (
    <AppContext.Provider
      value={{
        answers,
        results,
        saveAnswer,
        addResult
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}