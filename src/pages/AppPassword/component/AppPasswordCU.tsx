import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseModal from '@/components/common/model';
import { AppPasswordAPI, IAppPassword, NewAppPassword } from '@/utils/api/app-password.api';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import SwitchInput from '@/components/ui/Switch'

interface AppPasswordCUProps {
    isOpen: boolean;
    toggleModal: () => void;
    fetchLatestData: () => void;
    updateData?: IAppPassword;
}

const AppPasswordCU: React.FC<AppPasswordCUProps> = ({ isOpen, toggleModal, fetchLatestData, updateData }) => {
    const [isPassword, setIsPassword] = useState<boolean>(true)
    const [isActive, setIsActive] = useState<boolean>(updateData?.isActive ?? true);

    const { register, handleSubmit, formState: { errors } } = useForm<NewAppPassword>({
        defaultValues: updateData ? {
            eventName: updateData.eventName,
            password: updateData.password,
        } : {}
    });

    const togglePassword = () => {
        setIsPassword(!isPassword);
    };

    const onSubmit = async (data: NewAppPassword) => {
        try {
            const formData = {
                ...data,
                isActive,
            };
            const res = updateData?.id
                ? await AppPasswordAPI.update(updateData.id, formData)
                : await AppPasswordAPI.create(formData);

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
                                Event Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Event Name"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("eventName", {
                                        required: true, validate: (value) =>
                                            value.trim() !== '' || "Event Name cannot be empty or whitespace",
                                    })}
                                />
                            </div>
                            {errors.eventName && (
                                <div className="text-sm text-red-600">Event Name is required</div>
                            )}
                        </div>
                        <div className="mb-6">
                            <label className="mb-2.5 block font-medium">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={isPassword ? "password" : "text"}
                                    placeholder="password"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("password", {
                                        required: true,
                                        pattern: {
                                            value: /^\S+$/,
                                            message: "Password cannot contain spaces",
                                        },
                                    })}
                                    onKeyDown={(e) => {
                                        if (e.key === " ") {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        e.target.value = e.target.value.replace(/\s/g, "");
                                    }}
                                />

                                <span className="absolute right-4 top-4 cursor-pointer" onClick={togglePassword}>
                                    {isPassword ? <BsEye /> : <BsEyeSlash />}
                                </span>
                            </div>
                            {errors.password && (
                                <div className="text-sm text-red-600">{errors.password.message || `Password is required`}</div>
                            )}
                        </div>

                        {!updateData && <>
                            <div className="mb-4">
                                <p className='mb-2 block font-medium'>Is Active</p>
                                <SwitchInput
                                    initialValue={isActive}
                                    onChange={e => setIsActive(e)}
                                />
                            </div>
                        </>
                        }

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

export default AppPasswordCU;
