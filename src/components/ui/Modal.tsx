"use client";
import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface ModalButton {
  text: string;
  variant?: 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'ghost' | 'outline';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  buttons?: ModalButton[];
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  buttons = [],
  showCloseButton = true,
  closeOnBackdropClick = true,
  size = 'md',
  className = ''
}: ModalProps) {
  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      default:
        return 'max-w-md';
    }
  };

  const getButtonVariantClass = (variant: ModalButton['variant']) => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'error':
        return 'btn-error';
      case 'warning':
        return 'btn-warning';
      case 'success':
        return 'btn-success';
      case 'ghost':
        return 'btn-ghost';
      case 'outline':
        return 'btn-outline';
      default:
        return 'btn-outline';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <dialog className="modal modal-open">
      <div 
        className={`modal-box ${getSizeClasses()} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-4">
            {title && <h3 className="font-bold text-lg">{title}</h3>}
            {showCloseButton && (
              <button
                className="btn btn-ghost btn-sm btn-circle ml-auto"
                onClick={onClose}
                title="Close"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="modal-content">
          {children}
        </div>

        {/* Footer with buttons */}
        {buttons.length > 0 && (
          <div className="modal-action mt-6">
            <div className="flex gap-2 w-full justify-end">
              {buttons.map((button, index) => (
                <button
                  key={index}
                  className={`btn ${getButtonVariantClass(button.variant)}`}
                  onClick={button.onClick}
                  disabled={button.disabled || button.loading}
                >
                  {button.loading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      {button.text}
                    </>
                  ) : (
                    button.text
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleBackdropClick}>close</button>
      </form>
    </dialog>
  );
}