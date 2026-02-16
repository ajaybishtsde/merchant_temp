import React from "react";
import { GrClose } from "react-icons/gr";
import Modal from "react-modal";

const customStyles = {
    content: {
        background: "auto",
        height: "auto",
        width: "720px",
    },
    overlay: {
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999999,
    },
};

interface ModalProps {
    isOpen: boolean;
    toggleModal: () => void;
    children?: React.ReactNode;
    heading: string;
}

const AlertModel: React.FC<ModalProps> = ({
    isOpen,
    toggleModal,
    children,
    heading,
}) => {

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={toggleModal}
            style={customStyles}
            contentLabel="Example Modal"
            ariaHideApp={false}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-transparent rounded-md min-h-[80vh]"
        >
            <div className="bg-gray text-slate-800 flex justify-between py-2 rounded-tl-lg rounded-tr-lg px-5">
                <p className="text-xl font-medium">{heading}</p>
                <div className="cursor-pointer" onClick={toggleModal}>
                    <GrClose className='text-2xl capitalize font-extrabold' />
                </div>
            </div>
            <hr />
            <div className="">{children}</div>
        </Modal>
    );
};

export default AlertModel;