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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trapStartRef = useRef<HTMLSpanElement>(null);
  const trapEndRef = useRef<HTMLSpanElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        returnFocusRef?.current?.focus();
        wasOpenRef.current = false;
      }

      return;
    }

    const dialog = dialogRef.current;

    if (!dialog) return;

    dialog.showModal?.();

    wasOpenRef.current = true;
    closeButtonRef.current?.focus();
  }, [isOpen, returnFocusRef]);

  const handleClose = () => {
    dialogRef.current?.close?.();
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      handleClose();
      return;
    }

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
    <dialog
      ref={dialogRef}
      aria-labelledby={title ? titleId : undefined}
      className="z-50 m-0 border-0 bg-transparent p-4 open:fixed open:inset-0 open:flex open:h-full open:w-full open:max-h-none open:max-w-none open:items-center open:justify-center [&:modal]:fixed [&:modal]:inset-0 [&:modal]:m-0 [&:modal]:flex [&:modal]:h-full [&:modal]:w-full [&:modal]:max-h-none [&:modal]:max-w-none [&:modal]:items-center [&:modal]:justify-center [&:modal]:border-0 [&:modal]:bg-transparent [&::backdrop]:bg-black/70 [&::backdrop]:backdrop-blur-sm"
      onKeyDown={handleKeyDown}
      onCancel={(event) => {
        event.preventDefault();
        handleClose();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          handleClose();
        }
      }}
    >
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.07] bg-[#111111] p-0 shadow-[0_32px_80px_rgba(0,0,0,0.7)] outline-none">
        <span
          ref={trapStartRef}
          tabIndex={0}
          data-testid="modal-trap-start"
          className="sr-only"
        />

        <div className="relative p-7">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/[0.06] text-xs text-white/30 transition duration-150 hover:bg-white/[0.12] hover:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            ✕
          </button>

          {title && (
            <div className="mb-6">
              <p className="mb-1 text-xs uppercase tracking-widest text-white/30">
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
          className="sr-only"
        />
      </div>
    </dialog>,

    document.body
  );
}
