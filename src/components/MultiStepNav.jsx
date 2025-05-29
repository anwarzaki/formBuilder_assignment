import { useState } from "react";
import { useFormContext } from "../context/FormContext";
import ProgressBar from "./ProgressBar";

// Multi-step navigation
function MultiStepNav() {
  const { form } = useFormContext();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < form.steps) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="mt-52">
      <ProgressBar currentStep={currentStep} totalSteps={form.steps} />
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="p-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === form.steps}
          className="p-2 bg-gray-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default MultiStepNav;
