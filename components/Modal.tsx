export function Modal({ onClose, children, disabled }: {onClose: () => any, children: any, disabled: boolean}) {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-opacity-70 bg-gray-500 z-20"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-2xl rounded-lg overflow-hidden w-screen max-w-2xl max-h-screen overflow-auto"
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
