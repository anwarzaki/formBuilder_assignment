
export function saveForm(form) {
  localStorage.setItem("form", JSON.stringify(form));
}

export function getForm() {
  const form = localStorage.getItem("form");
  return form ? JSON.parse(form) : null;
}

export function loadForm(formId) {
  const data = localStorage.getItem(`form_${formId}`);
  return data ? JSON.parse(data) : null;
}

// Modified saveTemplate to use a name provided by the user
export function saveTemplate(template) {
  const templateName = prompt(
    "Enter a name for this template:",
    template.title
  );
  if (!templateName) return; // Cancelled by user
  const templates = loadTemplates();
  templates[templateName] = template;
  localStorage.setItem("templates", JSON.stringify(templates));
}

export function loadTemplates() {
  const data = localStorage.getItem("templates");
  return data ? JSON.parse(data) : {};
}

export function saveResponse(response) {
  const responses = loadResponses(response.formId);
  responses.push(response);
  localStorage.setItem(
    `responses_${response.formId}`,
    JSON.stringify(responses)
  );
}

export function loadResponses(formId) {
  const data = localStorage.getItem(`responses_${formId}`);
  return data ? JSON.parse(data) : [];
}
