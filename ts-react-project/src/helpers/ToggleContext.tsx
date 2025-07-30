import React, { createContext, useContext, useState, ReactNode } from 'react';

const ToggleContext = createContext<{
  toggleState: Record<string, boolean>;
  setToggleState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
} | undefined>(undefined);

export const useToggle = () => {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error('useToggle must be used within a ToggleProvider');
  }
  return context;
};

interface ToggleProviderProps {
  children: ReactNode;
}

export const ToggleProvider: React.FC<ToggleProviderProps> = ({ children }) => {
  const [toggleState, setToggleState] = useState<Record<string, boolean>>({});

  return (
    <ToggleContext.Provider value={{ toggleState, setToggleState }}>
      {children}
    </ToggleContext.Provider>
  );
};
