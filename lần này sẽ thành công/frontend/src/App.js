import React, { useState } from "react";
import Home from "./components/Home";
import AnswerInput from "./components/AnswerInput";
import ScanQuiz from "./components/ScanQuiz";
import ResultReview from "./components/ResultReview";

function App() {
  const [page, setPage] = useState("home");
  const [examCode, setExamCode] = useState(null);
  const [scoreData, setScoreData] = useState(null);

  const handleBack = () => {
    setPage("home");
    setScoreData(null);
    setExamCode(null);
  };

  return (
    <div style={{ padding: 20 }}>
      {page === "home" && (
        <Home
          onSelectPage={(p) => {
            setPage(p);
          }}
          setExamCode={setExamCode}
        />
      )}
      {page === "answerInput" && (
        <AnswerInput
          examCode={examCode}
          onBack={handleBack}
          onSaved={() => alert("Lưu thành công")}
        />
      )}
      {page === "scanQuiz" && (
        <ScanQuiz
          examCode={examCode}
          onBack={handleBack}
          onScored={(data) => {
            setScoreData(data);
            setPage("resultReview");
          }}
        />
      )}
      {page === "resultReview" && (
        <ResultReview data={scoreData} onBack={() => setPage("home")} />
      )}
    </div>
  );
}

export default App;