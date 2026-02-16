import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseModal from '@/components/common/model';
import { PriceRangeAPI, IPriceRange, NewPriceRange } from '@/utils/api/priceRange.api';

interface PriceRangeCUProps {
    isOpen: boolean;
    toggleModal: () => void;
    fetchLatestData: () => void;
    updateData?: IPriceRange;
}

const PriceRangeCU: React.FC<PriceRangeCUProps> = ({ isOpen, toggleModal, fetchLatestData, updateData }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<NewPriceRange>({
        defaultValues: updateData ? {
            range: updateData.range,
        } : {}
    });

    const onSubmit = async (data: NewPriceRange) => {
        try {
            const formData = new FormData();
            formData.append('range', data.range);
            // API call for either creating or updating the PriceRange
            const res = updateData?.id
                ? await PriceRangeAPI.update(updateData.id, formData)
                : await PriceRangeAPI.create(formData);

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
            <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading='Price Range'>
                <div className="w-full p-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Name Input */}
                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium">Enter range</label>
                            <input
                                type="text"
                                placeholder="Enter PriceRange Name"
                                {...register("range", { required: true })}
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.range && (
                                <div className="text-sm text-red-600">Price range is required</div>
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

export default PriceRangeCU;
