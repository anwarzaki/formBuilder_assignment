import { useState } from "react";
import { useParams } from "react-router-dom";
import { getForm, saveResponse } from "../utils/storage";

// Form filler component
function FormFiller() {
  const { formId } = useParams();
  const form = getForm();
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  if (!form || form.id !== formId) {
    return <p className="p-6 text-red-500">Form not found.</p>;
  }

  const fields = form.fields.filter((field) => field.step === currentStep);

  // Handle input change
  const handleChange = (fieldId, value) => {
    setResponses({ ...responses, [fieldId]: value });
    setErrors({ ...errors, [fieldId]: null });
  };

  // Validate fields
  const validateFields = () => {
    const newErrors = {};
    fields.forEach((field) => {
      const value = responses[field.id] || "";
      if (field.required && !value) {
        newErrors[field.id] = `${field.label} is required`;
      }
      if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
        newErrors[field.id] = `${field.label} is invalid`;
      }
      if (field.minLength && value.length < field.minLength) {
        newErrors[
          field.id
        ] = `${field.label} must be at least ${field.minLength} characters`;
      }
      if (field.maxLength && value.length > field.maxLength) {
        newErrors[
          field.id
        ] = `${field.label} must be at most ${field.maxLength} characters`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle navigation between steps
  const handleNext = () => {
    if (validateFields()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateFields() && currentStep === form.steps) {
      saveResponse(formId, responses);
      alert("Form submitted successfully!");
      setResponses({});
      setCurrentStep(1);
    } else if (validateFields()) {
      handleNext();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
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
                className="p-2 border rounded w-full"
                placeholder={field.placeholder}
              />
            )}
            {field.type === "textarea" && (
              <textarea
                value={responses[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="p-2 border rounded w-full"
                placeholder={field.placeholder}
              />
            )}
            {field.type === "dropdown" && (
              <select
                value={responses[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="" disabled>
                  {field.placeholder}
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
                className="p-2 border rounded w-full"
                placeholder={field.placeholder}
              />
            )}
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            {errors[field.id] && (
              <p className="text-red-500">{errors[field.id]}</p>
            )}
          </div>
        ))}
        <div className="flex justify-between mt-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="p-2 bg-gray-500 text-white rounded"
            >
              Previous
            </button>
          )}
          {currentStep < form.steps ? (
            <button
              type="button"
              onClick={handleNext}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          )}
        </div>
      </form>
      {form.steps > 1 && (
        <div className="mt-4">
          <p>
            Step {currentStep} of {form.steps}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{ width: `${(currentStep / form.steps) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormFiller;
