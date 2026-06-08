import { useRef, useState } from 'react';
import { Modal } from './components/Modal/Modal';
import { UncontrolledForm } from './components/Forms/UncontrolledForm/UncontrolledForm';
import { RHFForm } from './components/Forms/RHFForm/RHFForm';
import { useAppSelector, selectSubmissions } from '@/store/hooks';
import { SubmissionCard } from './components/SubmissionCard/SubmissionCard';
import { Button } from './components/ui/Button';

function App() {
  const [openModal, setOpenModal] = useState<'uncontrolled' | 'rhf' | null>(
    null
  );
  const [lastId, setLastId] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const submissions = useAppSelector(selectSubmissions);
  const uncontrolledTriggerRef = useRef<HTMLButtonElement>(null);
  const rhfTriggerRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setOpenModal(null);
    setFormKey((key) => key + 1);
  };

  const handleSubmitSuccess = (id: string) => {
    setLastId(id);
    setOpenModal(null);
  };

  return (
    <>
      <div
        data-testid="page-root"
        className="min-h-screen bg-[#0a0a0a]"
        inert={openModal !== null}
      >
        <div className="mx-auto max-w-xl px-4 py-16">
          <header className="mb-12 text-center">
            <p className="text-xs text-white/20 uppercase tracking-[.2em] mb-3">
              React
            </p>
            <h1 className="text-3xl font-semibold text-white tracking-tight mb-3">
              Forms
            </h1>
            <p className="text-sm text-white/30">
              {submissions.length === 0
                ? 'No submissions yet'
                : `${submissions.length} submission${submissions.length !== 1 ? 's' : ''}`}
            </p>
          </header>

          <div className="flex gap-3 justify-center mb-12">
            <Button
              ref={uncontrolledTriggerRef}
              variant="ghost"
              onClick={() => setOpenModal('uncontrolled')}
            >
              Uncontrolled form
            </Button>

            <Button
              ref={rhfTriggerRef}
              variant="primary"
              onClick={() => setOpenModal('rhf')}
            >
              React Hook Form
            </Button>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4 opacity-20">○</div>
              <p className="text-sm text-white/20">
                Fill out a form above to see results here
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {[...submissions].reverse().map((s) => (
                <SubmissionCard
                  key={s.id}
                  submission={s}
                  isNew={s.id === lastId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={openModal === 'uncontrolled'}
        onClose={handleClose}
        title="Uncontrolled Form"
        returnFocusRef={uncontrolledTriggerRef}
      >
        <UncontrolledForm
          key={`uc-${formKey}`}
          onClose={(id) => handleSubmitSuccess(id)}
        />
      </Modal>

      <Modal
        isOpen={openModal === 'rhf'}
        onClose={handleClose}
        title="React Hook Form"
        returnFocusRef={rhfTriggerRef}
      >
        <RHFForm
          key={`rhf-${formKey}`}
          onClose={(id) => handleSubmitSuccess(id)}
        />
      </Modal>
    </>
  );
}

export default App;
