import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-20 flex items-center justify-center p-3" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Background backdrop */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-80 transition-opacity" aria-hidden="true"></div>

            {/* Modal content */}
            <div className="relative bg-white rounded-3xl shadow-xl sm:w-[350px] md:w-[400px] lg:w-[550px] px-5 py-5 sm:ml-60">
                <div className="relative flex items-start">
                    {/* Close Button */}
                    <button
                        className="absolute right-1 p-0 bg-transparent text-gray-400 focus:outline-none"
                        onClick={onClose}
                    >
                        <AiOutlineClose className="h-5 w-5" aria-hidden="true" />
                    </button>

                    <div className="ml-4">
                        <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                            {title}
                        </h3>
                        <div className="mt-2 leading-none">
                            <p className="text-sm text-gray-500 leading-none">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2 leading-none">
                    {/* Cancel Button */}
                    <button
                        type="button"
                        className="rounded-full mt-8 py-2 font-medium transition-all duration-300 flex items-center justify-center px-4 bg-gray-300 text-gray-700 hover:bg-gray-400"
                        style={{ width: "100px" }}
                        onClick={onClose}
                    >
                        <span className="text-center">Cancel</span>
                    </button>
                    {/* Confirm Button */}
                    <button
                        type="button"
                        className="rounded-full mt-8 py-2 font-medium transition-all duration-300 flex items-center justify-center px-4 bg-red-500 text-white hover:bg-red-600"
                        style={{ width: "100px" }}
                        onClick={onConfirm}
                    >
                        <span className="text-center">{confirmLabel}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
