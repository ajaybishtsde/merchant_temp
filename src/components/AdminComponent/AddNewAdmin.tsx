import React from 'react'
import BaseModal from '../common/model'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { TfiEmail } from 'react-icons/tfi';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { FaPhone } from 'react-icons/fa6';
import { FaUser } from 'react-icons/fa';
import { AdminAPI, IAdmin, NewAdmin } from '@/utils/api/admin.api';

interface AddNewAdminProps {
    isOpen: boolean;
    toggleModal: () => void;
    fetchAdmins: () => void;
    updateAdminData?: IAdmin;
}
const AddNewAdmin: React.FC<AddNewAdminProps> = (
    { isOpen, toggleModal, fetchAdmins, updateAdminData }
) => {
    const [isPassword, setIsPassword] = React.useState<boolean>(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<NewAdmin>({
        defaultValues: updateAdminData ? {
            firstName: updateAdminData.firstName,
            lastName: updateAdminData.lastName,
            phoneNumber: updateAdminData.phoneNumber,
            email: updateAdminData.email,
            dob: new Date(updateAdminData.dob).toISOString().split('T')[0],
        } : {},
    });

    const onSubmit = async (data: NewAdmin) => {
        try {
            let res: any;
            if (updateAdminData?.id) {
                res = await AdminAPI.update(updateAdminData?.id, {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    // email: data.email,
                    dob: data.dob,
                    // phoneNumber: data.phoneNumber,
                });

            } else {
                res = await AdminAPI.addNew({
                    ...data,
                    phoneNumber: `+91${data.phoneNumber}`,
                });
            }
            if (res.status) {
                toast.success(`admin ${updateAdminData?.id ? 'update' : 'add'} successfully`);
                fetchAdmins()
                toggleModal()
            }
        } catch (error: any) {
            toast.error(error?.message || "Something went wrong", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            });
        }
    };

    const togglePassword = () => {
        setIsPassword(!isPassword);
    };

    return (
        <div className='container mx-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading={updateAdminData ? "Update admin" : "Add new admin"}>
                <div className="w-full">
                    <div className="w-full p-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium">
                                    First name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter your first name"
                                        {...register("firstName", { required: true })}
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />

                                    <span className="absolute right-4 top-4">
                                        <FaUser />
                                    </span>
                                </div>
                                {errors.firstName && (
                                    <div className="text-sm text-red-600">First Name is required</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter your last name"
                                        {...register("lastName", { required: true })}
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />

                                    <span className="absolute right-4 top-4">
                                        <FaUser />
                                    </span>
                                </div>
                                {errors.lastName && (
                                    <div className="text-sm text-red-600">Last Name is required</div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        disabled={updateAdminData?.id ? true : false}
                                        placeholder="Enter your email"
                                        {...register("email", { required: true })}
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />

                                    <span className="absolute right-4 top-4">
                                        <TfiEmail />
                                    </span>
                                </div>
                                {errors.email && (
                                    <div className="text-sm text-red-600">Email is required</div>
                                )}
                            </div>

                            {!updateAdminData?.id && <div className="mb-6">
                                <label className="mb-2.5 block font-medium">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={isPassword ? "password" : "text"}
                                        placeholder="6+ Characters, 1 Capital letter"
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("password", { required: true })}
                                    />

                                    <span className="absolute right-4 top-4 cursor-pointer" onClick={togglePassword}>
                                        {isPassword ? <BsEye /> : <BsEyeSlash />}
                                    </span>
                                </div>
                                {errors.password && (
                                    <div className="text-sm text-red-600">Password is required</div>
                                )}
                            </div>}
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium">
                                    Phone
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        placeholder="Enter your number"
                                        disabled={updateAdminData?.id ? true : false}
                                        {...register("phoneNumber", { required: true })}
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />

                                    <span className="absolute right-4 top-4">
                                        <FaPhone />
                                    </span>
                                </div>
                                {errors.phoneNumber && (
                                    <div className="text-sm text-red-600">Phone is required</div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium">
                                    Date of Birth
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        placeholder="Enter your dob"
                                        {...register("dob", { required: true })}
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />

                                </div>
                                {errors.dob && (
                                    <div className="text-sm text-red-600">Date of birth is required</div>
                                )}
                            </div>


                            <div className="mb-5">
                                <input
                                    type="submit"
                                    value={updateAdminData ? "Update admin" : "Add New Admin"}
                                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </BaseModal>
        </div>
    )
}

export default AddNewAdmin