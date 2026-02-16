import { NewSendBulkNotification } from '@/utils/api/send-bulk-notification.api';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { v4 as uuidv4 } from 'uuid';

const customStyles = {
  content: {
    background: 'auto',
    height: 'auto',
    width: '100%',
  },
  overlay: {
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999999,
  },
};

interface ModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  onConfirm: (key: string) => void;
  isSending?: boolean;
  notificationData: NewSendBulkNotification;
}

const ConfirmModel: React.FC<ModalProps> = ({
  isOpen,
  toggleModal,
  onConfirm,
  isSending,
  notificationData,
}) => {
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');

  useEffect(() => {
    setIdempotencyKey(uuidv4());
  }, []);

  const handleConfirm = () => {
    if (isSending) return;
    onConfirm(idempotencyKey);
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent rounded-md"
      >
        <div id="popup-modal" className="flex justify-center items-center">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={toggleModal}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to send this notification?
                </h3>
                <div className="mb-2">
                  <strong>Title:</strong> {notificationData?.title}
                </div>
                <div className="mb-4">
                  <strong>Message:</strong> {notificationData?.message}
                </div>
                <button
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                  onClick={handleConfirm}
                  disabled={isSending}
                >
                  {isSending ? 'Sending..' : "Yes, I'm sure"}
                </button>
                <button
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  onClick={toggleModal}
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmModel;
