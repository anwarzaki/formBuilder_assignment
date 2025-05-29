import { useEffect } from "react";
import { useFormContext } from "../context/FormContext";
import { loadTemplates, saveTemplate } from "../utils/storage";
import { v4 as uuidv4 } from "uuid";

function TemplateSelector() {
  const { form, updateForm } = useFormContext();
  const templates = loadTemplates();

  // Predefine templates if none exist
  useEffect(() => {
    const existingTemplates = loadTemplates();
    if (Object.keys(existingTemplates).length === 0) {
      const predefinedTemplates = {
        "Contact Us": {
          id: uuidv4(),
          title: "Contact Us",
          fields: [
            {
              id: uuidv4(),
              type: "text",
              label: "Name",
              required: true,
              step: 1,
              minLength: 2,
              maxLength: 50,
              pattern: "",
              placeholder: "Enter your name",
            },
            {
              id: uuidv4(),
              type: "text",
              label: "Email",
              required: true,
              step: 1,
              minLength: 5,
              maxLength: 100,
              pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
              placeholder: "Enter your email",
            },
            {
              id: uuidv4(),
              type: "textarea",
              label: "Message",
              required: true,
              step: 1,
              placeholder: "Enter your message",
              helpText: "Please provide details",
            },
          ],
          steps: 1,
        },
        "My Form": {
          id: uuidv4(),
          title: "My Form",
          fields: [
            {
              id: uuidv4(),
              type: "text",
              label: "Type Something..",
              required: true,
              step: 1,
              minLength: 0,
              maxLength: 100,
              pattern: "",
              placeholder: "Type..",
            },
            {
              id: uuidv4(),
              type: "dropdown",
              label: "Gender",
              required: true,
              step: 1,
              options: ["Male", "Female"],
              placeholder: "Choose gender",
            },
          ],
          steps: 1,
        },
      };
      localStorage.setItem("templates", JSON.stringify(predefinedTemplates));
    }
  }, []);

  const loadTemplate = (templateName) => {
    const template = templates[templateName];
    if (template) {
      updateForm(template);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">Load Template</h3>
      <select
        onChange={(e) => loadTemplate(e.target.value)}
        className="p-2 border rounded w-full dark:bg-gray-700 dark:text-white"
        aria-label="Select a template"
      >
        <option value="">Select a template</option>
        {Object.keys(templates).map((templateName) => (
          <option key={templateName} value={templateName}>
            {templateName}
          </option>
        ))}
      </select>
      <button
        onClick={() => saveTemplate(form)}
        className="p-2 bg-blue-500 text-white rounded mt-2"
        aria-label="Save current form as template"
      >
        Save as Template
      </button>
    </div>
  );
}

export default TemplateSelector;
