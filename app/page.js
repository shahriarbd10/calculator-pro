"use client";

import { useMemo, useState } from "react";

const keys = [
  "C", "DEL", "%", "/",
  "7", "8", "9", "*",
  "4", "5", "6", "-",
  "1", "2", "3", "+",
  "0", ".", "=", "ANS"
];

const operators = ["+", "-", "*", "/", "%"];

function safeEval(expression) {
  if (!expression || /[^0-9+\-*/%.() ]/.test(expression)) {
    return null;
  }

  try {
    const result = Function(`\"use strict\"; return (${expression})`)();
    if (typeof result === "number" && Number.isFinite(result)) {
      return result;
    }
    return null;
  } catch {
    return null;
  }
}

function formatResult(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}

function getAssistance(expression) {
  if (!expression) {
    return "Tip: start with numbers, then use operators for quick math.";
  }

  const last = expression[expression.length - 1];
  if (operators.includes(last)) {
    return "Assistant: add a number next to complete your expression.";
  }

  if (/\d+[+\-*/%]\d+$/.test(expression)) {
    return "Assistant: press = to calculate, or chain another operator.";
  }

  return "Assistant: you can use ANS to reuse the last result.";
}

function getSuggestions(expression, result) {
  if (!expression) {
    return [
      { label: "Try 25*4", value: "25*4" },
      { label: "Try 99/3", value: "99/3" },
      { label: "Try 12+8", value: "12+8" }
    ];
  }

  const last = expression[expression.length - 1];
  if (operators.includes(last)) {
    return [
      { label: "Add 10", value: "10" },
      { label: "Add 25", value: "25" },
      { label: "Add 100", value: "100" }
    ];
  }

  if (result !== "0") {
    return [
      { label: "+10", value: "+10" },
      { label: "x2", value: "*2" },
      { label: "Square", value: "*" + result }
    ];
  }

  return [
    { label: "+", value: "+" },
    { label: "-", value: "-" },
    { label: "*", value: "*" }
  ];
}

export default function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [lastAnswer, setLastAnswer] = useState("0");

  const assistance = useMemo(() => getAssistance(expression), [expression]);
  const suggestions = useMemo(() => getSuggestions(expression, result), [expression, result]);

  function appendValue(value) {
    setExpression((prev) => prev + value);
  }

  function onKeyPress(key) {
    if (key === "C") {
      setExpression("");
      setResult("0");
      return;
    }

    if (key === "DEL") {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }

    if (key === "=") {
      const evaluated = safeEval(expression);
      if (evaluated === null) {
        setResult("Error");
        return;
      }
      const formatted = formatResult(evaluated);
      setResult(formatted);
      setLastAnswer(formatted);
      return;
    }

    if (key === "ANS") {
      appendValue(lastAnswer);
      return;
    }

    appendValue(key);
  }

  function applySuggestion(suggestion) {
    if (operators.includes(suggestion.value[0]) && expression.length > 0) {
      appendValue(suggestion.value);
      return;
    }

    setExpression(suggestion.value);
  }

  return (
    <main>
      <section className="calculator" aria-label="Smart calculator">
        <div className="header">
          <h1 className="title">Smart Calc</h1>
          <span className="badge">Assist + Suggest</span>
        </div>

        <div className="display" role="status" aria-live="polite">
          <div className="expression">{expression || "0"}</div>
          <div className="result">{result}</div>
          <div className="help">{assistance}</div>
        </div>

        <div className="suggestions" aria-label="Predictive suggestions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              className="suggestion"
              onClick={() => applySuggestion(suggestion)}
            >
              {suggestion.label}
            </button>
          ))}
        </div>

        <div className="keypad">
          {keys.map((key) => {
            const lower = key.toLowerCase();
            const className = [
              "key",
              operators.includes(key) ? "operator" : "",
              key === "C" ? "clear" : "",
              key === "=" ? "equals" : "",
              key === "0" ? "zero" : ""
            ].join(" ").trim();

            return (
              <button
                key={key + lower}
                type="button"
                className={className}
                onClick={() => onKeyPress(key)}
              >
                {key}
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}
