import React, { useState, useEffect } from "react";
import QuestionItem from "./QuestionItem";

function QuestionList() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((response) => response.json())
      .then((data) => setQuestions(data))
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setQuestions(questions.filter((question) => question.id !== id));
      })
      .catch((error) => console.error("Error deleting question:", error));
  };

  const handleUpdate = (id, correctIndex) => {
    setQuestions(
      questions.map((question) =>
        question.id === id
          ? { ...question, correctIndex: parseInt(correctIndex) }
          : question
      )
    );
  };

  return (
    <ul>
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </ul>
  );
}

export default QuestionList;
