import React, { createContext, useContext, useState } from 'react';

interface EnquiryModalContextType {
  isOpen: boolean;
  initialProduct?: string;
  openEnquiryModal: (productName?: string) => void;
  closeEnquiryModal: () => void;
}

const EnquiryModalContext = createContext<EnquiryModalContextType | undefined>(undefined);

export const EnquiryModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [initialProduct, setInitialProduct] = useState<string | undefined>(undefined);

  const openEnquiryModal = (productName?: string) => {
    setInitialProduct(productName);
    setIsOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsOpen(false);
    setInitialProduct(undefined);
  };

  return (
    <EnquiryModalContext.Provider value={{ isOpen, initialProduct, openEnquiryModal, closeEnquiryModal }}>
      {children}
    </EnquiryModalContext.Provider>
  );
};

export const useEnquiryModal = () => {
  const context = useContext(EnquiryModalContext);
  if (!context) {
    throw new Error('useEnquiryModal must be used within an EnquiryModalProvider');
  }
  return context;
};
