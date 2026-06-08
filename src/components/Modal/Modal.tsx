import { type JSX, type RefObject, useEffect, useRef } from 'react';
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
}: ModalProps): JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trapStartRef = useRef<HTMLSpanElement>(null);
  const trapEndRef = useRef<HTMLSpanElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      wasOpenRef.current = true;
      if (!dialog.open) {
        dialog.showModal();
      }
      return;
    }

    if (wasOpenRef.current && dialog.open) {
      dialog.close();
      returnFocusRef?.current?.focus();
      wasOpenRef.current = false;
    }
  }, [isOpen, returnFocusRef]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
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

  const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      onClose();
    }
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      onKeyDown={handleKeyDown}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className="
        fixed m-auto w-full max-w-lg max-h-[90vh] overflow-y-auto p-0
        rounded-2xl outline-none
        bg-[#111111]
        border border-white/[0.07]
        shadow-[0_32px_80px_rgba(0,0,0,0.7)]
        backdrop:bg-black/70 backdrop:backdrop-blur-sm
        [:not([open])]:hidden
      "
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
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="
            absolute top-4 right-4 z-10
            h-7 w-7 flex items-center justify-center
            rounded-full text-xs cursor-pointer
            bg-white/[0.06] hover:bg-white/[0.12]
            text-white/30 hover:text-white/70
            transition duration-150
            focus:outline-none focus:ring-2 focus:ring-white/20
          "
        >
          ✕
        </button>

        {title && (
          <div className="mb-6">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-1">
              Form
            </p>
            <h2 id="modal-title" className="text-xl font-semibold text-white">
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
    </dialog>,
    document.body
  );
}
