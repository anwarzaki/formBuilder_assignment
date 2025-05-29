import { createContext, useContext, useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { saveForm, getForm } from "../utils/storage";
import { useLocation } from "react-router-dom";

// Define context
const FormContext = createContext();

// Provide form state and functions
export function FormProvider({ children }) {
  const location = useLocation();
  const initialForm = getForm() || {
    id: uuidv4(),
    title: "My Form",
    fields: [],
    steps: 1,
  };

  const [form, setForm] = useState(initialForm);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [theme, setTheme] = useState("dark");
  const [history, setHistory] = useState([initialForm]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoingOrRedoing = useRef(false);

  // Reset history when navigating back to Form Builder
  useEffect(() => {
    if (location.pathname === "/") {
      const loadedForm = getForm() || initialForm;
      console.log(
        "Navigated to Form Builder, resetting history with form:",
        loadedForm
      );
      setForm(loadedForm);
      setHistory([loadedForm]);
      setHistoryIndex(0);
    }
  }, [location.pathname]);

  // Save form to localStorage, but skip during undo/redo
  useEffect(() => {
    if (!isUndoingOrRedoing.current) {
      console.log("Saving form to localStorage:", form);
      saveForm(form);
    }
  }, [form]);

  const addField = (type) => {
    const newField = {
      id: uuidv4(),
      type,
      label: `${type} Field`,
      required: false,
      step: 1,
      ...(type === "dropdown" ? { options: ["Option 1", "Option 2"] } : {}),
      ...(type === "text" ? { minLength: 0, maxLength: 100, pattern: "" } : {}),
    };
    const newForm = { ...form, fields: [...form.fields, newField] };
    updateForm(newForm);
  };

  const updateField = (id, updates) => {
    const newFields = form.fields.map((field) =>
      field.id === id ? { ...field, ...updates } : field
    );
    updateForm({ ...form, fields: newFields });
  };

  const reorderFields = (fields) => {
    updateForm({ ...form, fields });
  };

  const setStepCount = (steps) => {
    updateForm({ ...form, steps });
  };

  const updateForm = (newForm) => {
    console.log("Updating form:", newForm);
    console.log("History before update:", history, "Index:", historyIndex);
    setForm(newForm);
    const newHistory = [...history.slice(0, historyIndex + 1), newForm];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    console.log(
      "History after update:",
      newHistory,
      "New Index:",
      newHistory.length - 1
    );
  };

  const undo = () => {
    if (historyIndex > 0) {
      isUndoingOrRedoing.current = true;
      setHistoryIndex((prev) => {
        const newIndex = prev - 1;
        console.log("Undoing to index:", newIndex, "Form:", history[newIndex]);
        setForm(history[newIndex]);
        isUndoingOrRedoing.current = false;
        return newIndex;
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      isUndoingOrRedoing.current = true;
      setHistoryIndex((prev) => {
        const newIndex = prev + 1;
        console.log("Redoing to index:", newIndex, "Form:", history[newIndex]);
        setForm(history[newIndex]);
        isUndoingOrRedoing.current = false;
        return newIndex;
      });
    }
  };

  const resetForm = () => {
    const newForm = {
      id: uuidv4(),
      title: "My Form",
      fields: [],
      steps: 1,
    };
    console.log("Resetting form to:", newForm);
    setForm(newForm);
    setHistory([newForm]);
    setHistoryIndex(0);
    saveForm(newForm); // Ensure the new form is saved to localStorage
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const value = {
    form,
    addField,
    updateField,
    reorderFields,
    setStepCount,
    previewMode,
    setPreviewMode,
    theme,
    toggleTheme,
    undo,
    redo,
    updateForm,
    resetForm, // Add resetForm to context
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
