import { useFormContext } from '../context/FormContext';

function FieldConfig({ field }) {
  const { updateField } = useFormContext();

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={field.label}
        onChange={(e) => updateField(field.id, { label: e.target.value })}
        className="p-2 border rounded w-full"
        placeholder="Field Label"
      />
      {field.type !== 'checkbox' && (
        <input
          type="text"
          value={field.placeholder || ''}
          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
          className="p-2 border rounded w-full"
          placeholder="Placeholder"
        />
      )}
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => updateField(field.id, { required: e.target.checked })}
          className="mr-2"
        />
        Required
      </label>
      <input
        type="text"
        value={field.helpText || ''}
        onChange={(e) => updateField(field.id, { helpText: e.target.value })}
        className="p-2 border rounded w-full"
        placeholder="Help Text"
      />
      {field.type === 'dropdown' && (
        <textarea
          value={field.options?.join('\n') || ''}
          onChange={(e) => updateField(field.id, { options: e.target.value.split('\n') })}
          className="p-2 border rounded w-full"
          placeholder="Options (one per line)"
        />
      )}
      {field.type === 'text' && (
        <>
          <input
            type="number"
            value={field.minLength || 0}
            onChange={(e) => updateField(field.id, { minLength: Number(e.target.value) })}
            className="p-2 border rounded w-full"
            placeholder="Min Length"
          />
          <input
            type="number"
            value={field.maxLength || 100}
            onChange={(e) => updateField(field.id, { maxLength: Number(e.target.value) })}
            className="p-2 border rounded w-full"
            placeholder="Max Length"
          />
          <input
            type="text"
            value={field.pattern || ''}
            onChange={(e) => updateField(field.id, { pattern: e.target.value })}
            className="p-2 border rounded w-full"
            placeholder="Pattern (e.g., ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ for email)"
          />
        </>
      )}
      <select
        value={field.step}
        onChange={(e) => updateField(field.id, { step: Number(e.target.value) })}
        className="p-2 border rounded w-full"
      >
        {Array.from({ length: useFormContext().form.steps }, (_, i) => i + 1).map((step) => (
          <option key={step} value={step}>
            Step {step}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FieldConfig;