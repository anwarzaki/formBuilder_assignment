import { useState } from "react";
import { useFormContext } from "../context/FormContext";
import { validateField } from "../utils/validators";

// Real-time form preview
function FormPreview() {
  const { form, previewMode } = useFormContext();
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (fieldId, value) => {
    setValues({ ...values, [fieldId]: value });
    const field = form.fields.find((f) => f.id === fieldId);
    setErrors({ ...errors, [fieldId]: validateField(field, value) });
  };

  const getWidth = () => {
    if (previewMode === "mobile") return "w-80";
    if (previewMode === "tablet") return "w-96";
    return "w-full";
  };

  return (
    <div className={`p-4 border rounded  ${getWidth()}`}>
      {form.fields.map((field) => (
        <div key={field.id} className="mb-4">
          <label className="block mb-1">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === "text" && (
            <input
              type="text"
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="p-2 border rounded w-full"
            />
          )}
          {field.type === "textarea" && (
            <textarea
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="p-2 border rounded w-full"
            />
          )}
          {field.type === "dropdown" && (
            <select
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="">
                {field.placeholder || "Select an option"}
              </option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {field.type === "checkbox" && (
            <input
              type="checkbox"
              onChange={(e) => handleChange(field.id, e.target.checked)}
              className="mr-2"
            />
          )}
          {field.type === "date" && (
            <input
              type="date"
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="p-2 border rounded w-full"
            />
          )}
          {field.helpText && (
            <p className="text-sm text-gray-500">{field.helpText}</p>
          )}
          {errors[field.id]?.map((error) => (
            <p key={error} className="text-red-500 text-sm">
              {error}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export default FormPreview;
