import Image from 'next/image';
import React from 'react';

const Modal = ({ isOpen, onClose, src }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <Image src={src} alt="Large Image" style={{ maxWidth: '500px', width: '100%' }} />
        <button className="mt-4 px-4 py-2 bg-gray-700 text-white rounded" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
