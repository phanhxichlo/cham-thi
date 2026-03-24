import { createContext, useContext, useState, useEffect } from "react";

// tạo context
const AppContext = createContext();

// provider bọc toàn app
export function AppProvider({ children }) {
  // đáp án theo mã đề
  const [answers, setAnswers] = useState({});

  // bài đã chấm
  const [results, setResults] = useState([]);

  // load từ localStorage khi mở app
  useEffect(() => {
    const a = localStorage.getItem("answers");
    const r = localStorage.getItem("results");

    if (a) setAnswers(JSON.parse(a));
    if (r) setResults(JSON.parse(r));
  }, []);

  // lưu mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  // thêm / cập nhật đáp án
  const saveAnswer = (examCode, data) => {
    setAnswers(prev => ({
      ...prev,
      [examCode]: data
    }));
  };

  // thêm bài đã chấm
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

// hook dùng cho dễ
export function useApp() {
  return useContext(AppContext);
}
