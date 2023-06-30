const Stepper = ({
  steps,
  currentStep,
  setCurrentStep,
  milestoneData,
}: {
  milestoneData: number;
  steps: number[];
  currentStep: number;
  setCurrentStep: (value: number) => void;
}) => {
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className='md:overflow-none grid grid-cols-2 gap-8 md:flex  '>
      {steps.map((step, index) => (
        <button
          onClick={() => handleStepChange(step - 1)}
          // disabled={milestoneData - 1 > step ? false : true}
          key={index}
          className={`flex h-20 w-20 items-center justify-center rounded-full border-4 hover:cursor-pointer ${
            index === currentStep
              ? ' border-0 bg-black/75 font-bold text-white'
              : 'text-gray-500'
          }`}
        >
          {step}
        </button>
      ))}
    </div>
  );
};

export default Stepper;
