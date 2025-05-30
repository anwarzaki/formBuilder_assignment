import { useParams } from "react-router-dom";
import { loadForm, loadResponses } from "../utils/storage";
import { useFormContext } from "../context/FormContext";
import { useState } from "react";

// View form responses
function Responses() {
  const { formId } = useParams();
  console.log("Form ID from URL:", formId); // Debug: Log the formId
  const form = loadForm(formId);
  console.log("Loaded form:", form); // Debug: Log the form
  const [responses, setResponses] = useState(loadResponses(formId));
  console.log("Loaded responses:", responses); // Debug: Log the responses
  const { theme } = useFormContext();

  const clearResponses = () => {
    // Add function
    localStorage.removeItem(`responses_${formId}`);
    setResponses([]);
  };

  if (!form) return <div>Form not found</div>;

  return (
    <div
      className={`p-6 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">Responses for {form.title}</h1>
      {responses.length === 0 ? (
        <p>No responses yet</p>
      ) : (
        responses.map((response, index) => (
          <div key={index} className="p-4 mb-4  rounded">
            <p>
              Submitted at: {new Date(response.submittedAt).toLocaleString()}
            </p>
            {Object.entries(response.responses).map(([fieldId, value]) => {
              const field = form.fields.find((f) => f.id === fieldId);
              return (
                <p key={fieldId}>
                  {field.label}: {value.toString()}
                </p>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}

export default Responses;
