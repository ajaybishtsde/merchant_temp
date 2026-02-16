import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseModal from '@/components/common/model';
import { AdminMessageAPI, IAdminMessage, NewAdminMessage } from '@/utils/api/admin-message.api';

interface AdminMessageCUProps {
    isOpen: boolean;
    toggleModal: () => void;
    fetchLatestData: () => void;
    updateData?: IAdminMessage;
}

const AdminMessageCU: React.FC<AdminMessageCUProps> = ({ isOpen, toggleModal, fetchLatestData, updateData }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<NewAdminMessage>({
        defaultValues: updateData ? {
            message: updateData.message,
        } : {}
    });


    const onSubmit = async (data: NewAdminMessage) => {
        try {
            const formData = {
                ...data,
            };
            const res = updateData?.id
                ? await AdminMessageAPI.update(updateData.id, formData)
                : await AdminMessageAPI.create(formData);

            if (res.status) {
                toast.success(res.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
                fetchLatestData();
                toggleModal();
            }
        } catch (error: any) {
            console.log("error: ", error)
            toast.error(error.message || 'Something went wrong', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            });
        }
    };

    return (
        <div className='container mx-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading='App Password'>
                <div className="w-full p-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-6">
                            <label className="mb-2.5 block font-medium">
                                Message
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="message"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("message", { required: true })}
                                />
                            </div>
                            {errors.message && (
                                <div className="text-sm text-red-600">Message is required</div>
                            )}
                        </div>

                        <div className="mb-5">
                            <input
                                type="submit"
                                value="Submit"
                                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                            />
                        </div>
                    </form>
                </div>
            </BaseModal>
        </div>
    );
};

export default AdminMessageCU;
