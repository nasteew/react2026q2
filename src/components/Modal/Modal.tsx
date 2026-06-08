import { type JSX, type RefObject, useEffect, useId, useRef } from 'react';

import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  returnFocusRef,
}: ModalProps): JSX.Element | null {
  const trapStartRef = useRef<HTMLSpanElement>(null);
  const trapEndRef = useRef<HTMLSpanElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const titleId = useId();

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      closeButtonRef.current?.focus();
      return;
    }

    if (wasOpenRef.current) {
      returnFocusRef?.current?.focus();
      wasOpenRef.current = false;
    }
  }, [isOpen, returnFocusRef]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      event.preventDefault();
      onClose();
    };

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && event.target === trapStartRef.current) {
      event.preventDefault();

      trapEndRef.current?.focus();

      return;
    }

    if (!event.shiftKey && event.target === trapEndRef.current) {
      event.preventDefault();

      trapStartRef.current?.focus();
    }
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
        onClick={onClose}
        tabIndex={-1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto p-0 rounded-2xl outline-none bg-[#111111] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
      >
        <span
          ref={trapStartRef}
          tabIndex={0}
          data-testid="modal-trap-start"
          aria-hidden="true"
          className="sr-only"
        />

        <div className="relative p-7">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-10 h-7 w-7 flex items-center justify-center rounded-full text-xs cursor-pointer  bg-white/[0.06] hover:bg-white/[0.12]  text-white/30 hover:text-white/70  transition duration-150  focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            ✕
          </button>

          {title && (
            <div className="mb-6">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-1">
                Form
              </p>

              <h2 id={titleId} className="text-xl font-semibold text-white">
                {title}
              </h2>
            </div>
          )}

          {children}
        </div>

        <span
          ref={trapEndRef}
          tabIndex={0}
          data-testid="modal-trap-end"
          aria-hidden="true"
          className="sr-only"
        />
      </div>
    </div>,

    document.body
  );
}
