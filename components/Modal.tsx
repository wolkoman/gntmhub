import {useEffect} from 'react';

export function Modal({ onClose, children, disabled }: {onClose: () => any, children: any, disabled: boolean}) {
  useEffect(() => {
    document.body.style.overflowY = 'hidden';
    return () => document.body.style.overflowY = 'auto';
  });
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center 0 bg-opacity-70 bg-gray-400 dark:bg-gray-900 z-20"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 shadow-2xl rounded overflow-hidden w-screen max-w-2xl max-h-screen overflow-auto"
        style={{
          filter: disabled ? "contrast(70%)" : "",
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
