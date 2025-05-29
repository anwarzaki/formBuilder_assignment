import { useFormContext } from '../context/FormContext';

// Theme toggle button
function ThemeToggle() {
  const { theme, toggleTheme } = useFormContext();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 bg-gray-500 text-white rounded"
    >
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
}

export default ThemeToggle;