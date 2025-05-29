// Progress bar for multi-step forms
function ProgressBar({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 rounded h-4 mb-4">
      <div
        className="bg-blue-500 h-4 rounded"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;