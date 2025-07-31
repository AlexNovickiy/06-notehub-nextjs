import NoteForm from '../NoteForm/NoteForm';
import css from './NoteModal.module.css';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';

interface NoteModalProps {
  onClose: () => void;
}

export default function NoteModal({ onClose }: NoteModalProps) {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscapeClick = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeClick);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscapeClick);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>
        <NoteForm onClose={onClose} />
      </div>
    </div>,
    document.body
  );
}
