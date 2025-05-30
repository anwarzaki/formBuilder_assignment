import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadForm, saveResponse } from "../utils/storage";

function FormFiller() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const form = loadForm(formId);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState("");

  if (!form) {
    return <div>Form not found</div>;
  }

  const handleChange = (fieldId, value) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => ({ ...prev, [fieldId]: "" }));
    setSubmissionError("");
  };

  const validateForm = () => {
    const newErrors = {};
    form.fields.forEach((field) => {
      if (field.required && !responses[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      } else if (
        field.required &&
        typeof responses[field.id] === "string" &&
        responses[field.id].trim() === ""
      ) {
        newErrors[field.id] = `${field.label} cannot be empty`; // Add check for empty strings
      }
      if (field.type === "text" && field.pattern && responses[field.id]) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(responses[field.id])) {
          newErrors[field.id] = `Invalid ${field.label}`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmissionError("");
    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      setSubmissionError("Please fill out all required fields correctly.");
      return;
    }
    const response = {
      formId,
      submittedAt: new Date().toISOString(),
      responses,
    };
    console.log("Saving response:", response);
    saveResponse(response);
    console.log(
      "Responses in localStorage after save:",
      localStorage.getItem(`responses_${formId}`)
    );
    navigate(`/responses/${formId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      {submissionError && (
        <p className="text-red-500 mb-4">{submissionError}</p>
      )}
      <form onSubmit={handleSubmit}>
        {form.fields.map((field) => (
          <div key={field.id} className="mb-4">
            <label className="block mb-1">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === "text" && (
              <input
                type="text"
                value={responses[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className={`p-2 border rounded w-full ${
                  errors[field.id] ? "border-red-500" : ""
                }`}
              />
            )}
            {field.type === "textarea" && (
              <textarea
                value={responses[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className={`p-2 border rounded w-full ${
                  errors[field.id] ? "border-red-500" : ""
                }`}
              />
            )}
            {field.type === "dropdown" && (
              <select
                value={responses[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className={`p-2 border rounded w-full ${
                  errors[field.id] ? "border-red-500" : ""
                }`}
              >
                <option value="">
                  {field.placeholder || "Select an option"}
                </option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
            {field.type === "checkbox" && (
              <input
                type="checkbox"
                checked={responses[field.id] || false}
                onChange={(e) => handleChange(field.id, e.target.checked)}
                className="mr-2"
              />
            )}
            {field.type === "date" && (
              <input
                type="date"
                value={responses[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                required={field.required}
                className={`p-2 border rounded w-full ${
                  errors[field.id] ? "border-red-500" : ""
                }`}
              />
            )}
            {errors[field.id] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
            )}
          </div>
        ))}
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </form>
    </div>
  );
}

export default FormFiller;
