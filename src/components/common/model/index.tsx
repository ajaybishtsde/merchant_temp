import React from 'react';
import { GrClose } from 'react-icons/gr';
import Modal from 'react-modal';

const customStyles = {
  content: {
    background: '#f5f2f2',
    height: 'auto',
  },
  overlay: {
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
};

interface ModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  children?: React.ReactNode;
  heading: string;
  customClass?: string;
}

Modal.setAppElement('#root')

const BaseModal: React.FC<ModalProps> = ({ isOpen, toggleModal, children, heading, customClass }) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={toggleModal}
      style={customStyles}
      contentLabel="Example Modal"
      ariaHideApp={false}
      className={customClass ? customClass : "md:w-[30rem] w-[90%] max-h-screen min-h-screen overflow-y-auto h-auto right-0 absolute z-50"}
    // className="md:w-[30rem] w-[90%] max-h-screen min-h-screen overflow-y-auto h-auto right-0 absolute z-50"
    >
      <div className="flex justify-between py-4 bg-white mb-1 rounded px-3">
        <p className="text-xl capitalize font-semibold">
          {heading}
        </p>
        <div className="cursor-pointer" onClick={toggleModal}>
          <GrClose fill='white' className='text-xl capitalize font-extrabold ' />
        </div>
      </div>
      <div className="px-2">
        {children}
      </div>
    </Modal>
  );
};

export default BaseModal;