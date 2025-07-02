import React, { useState } from "react";
import "../styles/Help.css";

const faqs = [
  {
    question: "How do I track my order?",
    answer: "You can track your order using the 'Track Order' page in your account section.",
  },
  {
    question: "What is the return policy?",
    answer: "We offer a 7-day return policy for all unused items in original packaging.",
  },
  {
    question: "How can I contact support?",
    answer: "You can email us at support@example.com or call our helpline 9am–6pm IST.",
  },
  // Add more FAQs here
];

const CustomerServicePage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="help-container">
      <h2>Customer Service Help Center</h2>
      <p className="sub-text">Find answers to your most common questions</p>
      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <div key={idx} className="faq-item">
            <div className="faq-question" onClick={() => toggleAnswer(idx)}>
              {faq.question}
              <span className="faq-toggle">{activeIndex === idx ? "−" : "+"}</span>
            </div>
            {activeIndex === idx && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerServicePage;
