import { useState } from "react";
import axios from "axios";

// Initial empty form state
const initialForm = {
  study_hours: "",
  attendance: "",
  sleep_hours: "",
  assignment_score: "",
  previous_gpa: "",
  participation: "",
  consistency: "",
  distraction: "",
};

// Label info for each field
const fieldConfig = [
  { key: "study_hours",      label: "Study Hours",       hint: "Hours per day (e.g. 5)"        },
  { key: "attendance",       label: "Attendance %",      hint: "Percentage (e.g. 85)"           },
  { key: "sleep_hours",      label: "Sleep Hours",       hint: "Hours per night (e.g. 7)"       },
  { key: "assignment_score", label: "Assignment Score",  hint: "Average score (e.g. 80)"        },
  { key: "previous_gpa",     label: "Previous GPA",      hint: "Your GPA (e.g. 7.5)"            },
  { key: "participation",    label: "Class Participation", hint: "Scale 1–10 (e.g. 8)"          },
  { key: "consistency",      label: "Study Consistency", hint: "Scale 1–10 (e.g. 7)"            },
  { key: "distraction",      label: "Distraction Level", hint: "Scale 1–10 (e.g. 3)"            },
];

export default function App() {
  const [form, setForm]           = useState(initialForm);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  // Update form state when user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Send data to Flask and get prediction
  const handleSubmit = async () => {
    setError("");
    setResult(null);

    // Check all fields are filled
    for (let field of fieldConfig) {
      if (form[field.key] === "") {
        setError(`Please fill in: ${field.label}`);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", form);
      setResult(response.data.predicted_marks);
    } catch (err) {
      setError("Could not connect to the server. Make sure Flask is running.");
    }
    setLoading(false);
  };

  // Reset everything
  const handleReset = () => {
    setForm(initialForm);
    setResult(null);
    setError("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🎓 Student Marks Predictor</h1>
          <p style={styles.subtitle}>
            Fill in your study details to predict your final marks
          </p>
        </div>

        {/* Form Grid */}
        <div style={styles.grid}>
          {fieldConfig.map((field) => (
            <div key={field.key} style={styles.fieldGroup}>
              <label style={styles.label}>{field.label}</label>
              <input
                type="number"
                name={field.key}
                value={form[field.key]}
                onChange={handleChange}
                placeholder={field.hint}
                style={styles.input}
              />
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Buttons */}
        <div style={styles.buttonRow}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={styles.predictBtn}
          >
            {loading ? "Predicting..." : "Predict Marks"}
          </button>
          <button onClick={handleReset} style={styles.resetBtn}>
            Reset
          </button>
        </div>

        {/* Result */}
        {result !== null && (
          <div style={styles.resultBox}>
            <p style={styles.resultLabel}>Predicted Final Marks</p>
            <p style={styles.resultScore}>{result}</p>
            <p style={styles.resultSub}>out of 100</p>
          </div>
        )}

      </div>
    </div>
  );
}

// ---- Styles ----
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "680px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#2d2d2d",
    margin: "0 0 8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#888",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "24px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#444",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1.5px solid #ddd",
    fontSize: "14px",
    outline: "none",
    transition: "border 0.2s",
  },
  errorBox: {
    background: "#fff0f0",
    border: "1px solid #ffcccc",
    color: "#cc0000",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "16px",
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  predictBtn: {
    flex: 1,
    padding: "14px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  resetBtn: {
    padding: "14px 24px",
    background: "#f5f5f5",
    color: "#555",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    cursor: "pointer",
  },
  resultBox: {
    background: "linear-gradient(135deg, #667eea15, #764ba215)",
    border: "2px solid #764ba2",
    borderRadius: "14px",
    textAlign: "center",
    padding: "28px",
  },
  resultLabel: {
    fontSize: "14px",
    color: "#764ba2",
    fontWeight: "600",
    margin: "0 0 8px",
  },
  resultScore: {
    fontSize: "64px",
    fontWeight: "800",
    color: "#2d2d2d",
    margin: "0",
    lineHeight: 1,
  },
  resultSub: {
    fontSize: "14px",
    color: "#999",
    margin: "8px 0 0",
  },
};