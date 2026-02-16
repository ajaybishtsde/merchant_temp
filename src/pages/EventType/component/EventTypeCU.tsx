import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseModal from '@/components/common/model';
import { EventTypeAPI, IEventType, NewEventType } from '@/utils/api/eventType.api';

interface EventTypeCUProps {
    isOpen: boolean;
    toggleModal: () => void;
    fetchLatestData: () => void;
    updateData?: IEventType;
}

const EventTypeCU: React.FC<EventTypeCUProps> = ({ isOpen, toggleModal, fetchLatestData, updateData }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<NewEventType>({
        defaultValues: updateData ? {
            name: updateData.name,
        } : {}
    });

    const onSubmit = async (data: NewEventType) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            // API call for either creating or updating the EventType
            const res = updateData?.id
                ? await EventTypeAPI.update(updateData.id, formData)
                : await EventTypeAPI.create(formData);

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
            <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading='Event Type'>
                <div className="w-full p-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Name Input */}
                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium">Enter Name</label>
                            <input
                                type="text"
                                placeholder="Enter EventType Name"
                                {...register("name", { required: true })}
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.name && (
                                <div className="text-sm text-red-600">Name is required</div>
                            )}
                        </div>

                        {/* Submit Button */}
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

export default EventTypeCU;
