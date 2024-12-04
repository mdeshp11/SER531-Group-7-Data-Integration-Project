import React from "react";

function Modal({ isOpen, closeModal, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={closeModal} className="close-btn">
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
