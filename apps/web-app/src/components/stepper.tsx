'use client';

import { Button } from '@b-prism/shadcn-ui/index';
import React, { createContext, useState, useContext } from 'react';
import { PacmanLoader } from 'react-spinners';

interface StepperContextProps {
    activeStep: number;
    setActiveStep: (step: number) => void;
    steps: { title: string; description: string }[];
}

const StepperContext = createContext<StepperContextProps | undefined>(undefined);

interface StepperProps {
    steps: { title: string; description: string }[];
    children: React.ReactNode;
    className?: string;
}

const Stepper = ({ steps, children, className }: StepperProps) => {
    const [activeStep, setActiveStep] = useState(0);

    return (
        <StepperContext.Provider value={{ activeStep, setActiveStep, steps }}>
            <div className={`${className}`}>{children}</div>
        </StepperContext.Provider>
    );
};

interface StepperHeaderProps {
    className?: string;
}

const StepperHeader = ({ className }: StepperHeaderProps) => {
    const { activeStep, steps } = useStepper();

    return (
        <div className={`relative flex w-full items-center justify-between ${className}`}>
            {steps.map((step, index) => (
                <React.Fragment key={step.title}>
                    <div className='relative flex flex-col w-full gap-2 px-1 mb-auto md:px-0 md:items-center md:flex-row'>
                        {/* Step Circle */}
                        <div
                            className={`w-8 h-8 rounded-full flex font-semibold items-center justify-center z-10 ${
                                index === activeStep
                                    ? 'bg-blue-500 transition-all animate-bounce duration-1000  text-white'
                                    : index < activeStep
                                      ? 'bg-green-500 text-white'
                                      : 'border border-gray-300 text-gray-500'
                            }`}>
                            {index + 1}
                        </div>

                        {/* Step Title */}
                        <div className={`text-sm font-semibold ${index === activeStep ? 'font-bold text-blue-500' : index < activeStep ? 'text-green-500' : 'text-gray-600'}`}>
                            {step.title}
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

interface StepperContentProps {
    children: (step: { title: string; description: string }) => React.ReactNode;
    className?: string;
}

const StepperContent = ({ children, className }: StepperContentProps) => {
    const { activeStep, steps } = useStepper();

    return (
        <div className={`${className}`}>
            {children(steps[activeStep])} {/* Call the function here */}
        </div>
    );
};

interface NextStepperButtonProps {
    className?: string;
    name?: string;
    completeTitle?: string;
    variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null;
    disabled?: boolean;
    isLoading?: boolean;
    onClick?: () => void;
}

const NextStepperButton = ({ className, name, completeTitle, variant, disabled, onClick, isLoading }: NextStepperButtonProps) => {
    const { activeStep, setActiveStep, steps } = useStepper();

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        }
    };

    const handleButtonClick = () => {
        if (activeStep === steps.length - 1 && onClick) {
            // If it's the last step, trigger the submit action.
            onClick();
        } else {
            // Otherwise, just proceed to the next step.
            handleNext();
        }
    };

    return (
        <Button
            type={activeStep === steps.length - 1 ? 'submit' : 'button'}
            onClick={handleButtonClick}
            disabled={disabled || activeStep === steps.length}
            variant={variant}
            className={`${className} px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600`}>
            {isLoading ? (
                <>
                    <PacmanLoader
                        className={`${isLoading ? 'pacman-loader-slide-in' : 'pacman-loader-slide-out'}`}
                        color='white'
                        size={10}
                    />
                </>
            ) : (
                <>{activeStep === steps.length - 1 ? `${completeTitle}` || 'Finish' : `${name}` || 'Next'}</>
            )}
        </Button>
    );
};

interface PreviousStepperButtonProps {
    className?: string;
    variant?: 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | null;
}

const PreviousStepperButton = ({ className, variant }: PreviousStepperButtonProps) => {
    const { activeStep, setActiveStep, steps } = useStepper();

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    return (
        <Button
            onClick={handleBack}
            disabled={activeStep === steps.length}
            variant={variant}
            className={`${className} px-4 py-2 rounded bg-transparent`}>
            Back
        </Button>
    );
};

const useStepper = () => {
    const context = useContext(StepperContext);

    if (!context) {
        throw new Error('useStepper must be used within a Stepper');
    }

    return context;
};

// ==============================
// Exports
// ==============================

export { Stepper, StepperHeader, StepperContent, NextStepperButton, PreviousStepperButton, useStepper };
