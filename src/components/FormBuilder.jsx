import { useDrag, useDrop } from "react-dnd";
import { useRef } from "react";
import { useFormContext } from "../context/FormContext";
import FieldConfig from "./FieldConfig";
import FormPreview from "./FormPreview";
import TemplateSelector from "./TemplateSelector";
import MultiStepNav from "./MultiStepNav";
import ThemeToggle from "./ThemeToggle";
import UndoRedo from "./UndoRedo";
import { useNavigate } from "react-router-dom";

// Draggable field component
function DraggableField({ field, index }) {
  const { reorderFields, form } = useFormContext();
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "field",
    item: { id: field.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "field",
    hover: (item) => {
      if (item.index === index) return;
      const newFields = [...form.fields];
      const draggedField = newFields[item.index];
      newFields.splice(item.index, 1);
      newFields.splice(index, 0, draggedField);
      reorderFields(newFields);
      item.index = index;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`p-4 mb-2 bg-gray-200 dark:bg-gray-700 rounded ${
        isDragging ? "opacity-50" : ""
      }`}
      role="listitem"
      aria-label={`Field ${field.label}`}
    >
      <FieldConfig field={field} />
    </div>
  );
}

// Main Form Builder component
function FormBuilder() {
  const {
    form,
    addField,
    setStepCount,
    previewMode,
    setPreviewMode,
    theme,
    resetForm,
  } = useFormContext();
  const navigate = useNavigate();

  // Export form as JSON
  const exportForm = () => {
    const data = JSON.stringify(form, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "form.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">{form.title}</h1>
        <div className="flex gap-4">
          <ThemeToggle />
          <UndoRedo />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={resetForm}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          aria-label="Create new form"
        >
          New Form
        </button>
        <button
          onClick={() => navigate(`/form/${form.id}`)}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          aria-label="Share form"
        >
          Share Form (ID: {form.id})
        </button>
        <button
          onClick={() => navigate(`/responses/${form.id}`)}
          className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          aria-label="View form responses"
        >
          View Responses
        </button>
        <button
          onClick={exportForm}
          className="p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          aria-label="Export form as JSON"
        >
          Export Form
        </button>
      </div>

      <div className="flex gap-4">
        {/* Add Field Buttons */}
        <div className="w-1/5 p-4 bg-white dark:bg-gray-800 rounded shadow">
          <h2 className="text-lg font-bold mb-2 text-black dark:text-white">
            Add Field
          </h2>
          {["text", "textarea", "dropdown", "checkbox", "date"].map((type) => (
            <button
              key={type}
              onClick={() => addField(type)}
              className="block w-full p-2 mb-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              aria-label={`Add ${type} field`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Form Fields */}
        <div className="w-2/5">
          <h2 className="text-lg font-bold mb-2">Form Fields</h2>
          {form.fields.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No fields added yet.
            </p>
          ) : (
            <div role="list" aria-label="Form fields">
              {form.fields.map((field, index) => (
                <DraggableField key={field.id} field={field} index={index} />
              ))}
            </div>
          )}
          <div className="mt-4">
            <label className="block mb-2">Steps:</label>
            <input
              type="number"
              min="1"
              value={form.steps}
              onChange={(e) => setStepCount(Number(e.target.value))}
              className="p-2 border rounded w-20 text-black dark:bg-gray-700 dark:text-white"
              aria-label="Number of steps"
            />
          </div>
          <TemplateSelector />
        </div>

        {/* Preview */}
        <div className="w-2/5">
          <h2 className="text-lg font-bold mb-2">Preview</h2>
          <select
            value={previewMode}
            onChange={(e) => setPreviewMode(e.target.value)}
            className="p-2 border rounded w-full mb-4 text-black dark:bg-gray-700 dark:text-white"
            aria-label="Preview mode selector"
          >
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
            <option value="mobile">Mobile</option>
          </select>
          <FormPreview />
        </div>
      </div>
      <MultiStepNav />
    </div>
  );
}

export default FormBuilder;
