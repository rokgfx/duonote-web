"use client";
import React, { createContext, useContext, useState } from 'react';
import Modal, { ModalButton } from '@/components/ui/Modal';

interface ModalOptions {
  title?: string;
  content: React.ReactNode;
  buttons?: ModalButton[];
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

interface ModalContextType {
  showModal: (options: ModalOptions) => void;
  hideModal: () => void;
  isModalOpen: boolean;
  // Convenience methods for common modal types
  showConfirmation: (options: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    variant?: 'error' | 'warning' | 'primary';
  }) => void;
  showAlert: (options: {
    title?: string;
    message: string;
    buttonText?: string;
    onClose?: () => void;
  }) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);

  const showModal = (options: ModalOptions) => {
    setModalOptions(options);
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
    setModalOptions(null);
  };

  const showConfirmation = ({
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    variant = 'primary'
  }: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    variant?: 'error' | 'warning' | 'primary';
  }) => {
    const buttons: ModalButton[] = [
      {
        text: cancelText,
        variant: 'ghost',
        onClick: () => {
          hideModal();
          onCancel?.();
        }
      },
      {
        text: confirmText,
        variant: variant,
        onClick: () => {
          hideModal();
          onConfirm();
        }
      }
    ];

    showModal({
      title,
      content: <div className="py-4">{message}</div>,
      buttons,
      showCloseButton: false,
      closeOnBackdropClick: false
    });
  };

  const showAlert = ({
    title = 'Notice',
    message,
    buttonText = 'OK',
    onClose
  }: {
    title?: string;
    message: string;
    buttonText?: string;
    onClose?: () => void;
  }) => {
    const buttons: ModalButton[] = [
      {
        text: buttonText,
        variant: 'primary',
        onClick: () => {
          hideModal();
          onClose?.();
        }
      }
    ];

    showModal({
      title,
      content: <div className="py-4">{message}</div>,
      buttons,
      showCloseButton: false,
      closeOnBackdropClick: false
    });
  };

  return (
    <ModalContext.Provider value={{
      showModal,
      hideModal,
      isModalOpen,
      showConfirmation,
      showAlert
    }}>
      {children}
      
      {/* Render the modal */}
      {modalOptions && (
        <Modal
          isOpen={isModalOpen}
          onClose={hideModal}
          {...(modalOptions.title !== undefined && { title: modalOptions.title })}
          {...(modalOptions.buttons !== undefined && { buttons: modalOptions.buttons })}
          {...(modalOptions.showCloseButton !== undefined && { showCloseButton: modalOptions.showCloseButton })}
          {...(modalOptions.closeOnBackdropClick !== undefined && { closeOnBackdropClick: modalOptions.closeOnBackdropClick })}
          {...(modalOptions.size !== undefined && { size: modalOptions.size })}
          {...(modalOptions.className !== undefined && { className: modalOptions.className })}
        >
          {modalOptions.content}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}