import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseModal from '@/components/common/model';
import { UserAPI, UserResponse } from '@/utils/api/user.api';
import Select from 'react-select';
import { NewSendBulkNotification, SendBulkNotificationAPI } from '@/utils/api/send-bulk-notification.api';
import { NotificationGroupAPI, NotificationGroupResponse } from '@/utils/api/notification-group.api';
import ConfirmModel from '@/components/common/model/ConfirmModel copy';
import SwitchInput from '@/components/ui/Switch';
import { HotspotAPI, HotspotResponse } from '@/utils/api/hotspot.api';

interface SendBulkNotificationCUProps {
    isOpen: boolean;
    toggleModal: () => void;
    fetchLatestData: () => void;
}

const SendBulkNotificationCU: React.FC<SendBulkNotificationCUProps> = ({ isOpen, toggleModal, fetchLatestData }) => {
    const { register, handleSubmit, formState: { errors }, control, watch } = useForm<NewSendBulkNotification>({});
    const type = watch("type");

    const [users, setUsers] = useState<UserResponse>({ count: 0, data: [] });
    const [notificationGroup, setNotificationGroup] = useState<NotificationGroupResponse>({ count: 0, data: [] });
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingFormData, setPendingFormData] = useState<NewSendBulkNotification | null>(null);
    const [isLink, setIsLink] = useState(false)
    const [isMultiLanguage, setIsMultiLanguage] = useState(false)
    const [isStored, setIsStored] = useState(false)
    const [hotspots, setHotspots] = useState<HotspotResponse>({ count: 0, data: { places: [], events: [] } });

    const fetchAllUsers = async () => {
        try {
            const res = await UserAPI.all({ includeTestUsers: true });
            if (res.status) {
                setUsers(res.result);
            }
            const hotspots = await HotspotAPI.getAll({ isActive: true });
            if (hotspots.status) {
                setHotspots(hotspots.result)
            }
        } catch (error) {
            console.log("error fetching users: ", error);
        }
    }

    const fetchSendBulkNotification = async () => {
        try {
            const res = await NotificationGroupAPI.getAll({ isActive: true });
            if (res.status) {
                setNotificationGroup(res.result);
            }
        } catch (error) {
            console.log("error fetchSendBulkNotification: ", error);
        }
    }

    useEffect(() => {
        fetchAllUsers();
        fetchSendBulkNotification();
    }, []);

    const userOptions = users.data.map((user) => ({
        label: `${user.user_firstName} ${user.user_lastName}`,
        value: user.user_id,
    }));

    const onSubmit = (data: NewSendBulkNotification) => {
        setPendingFormData(data);
        setShowConfirmModal(true);
    };

    const hotspotType = watch("hotspotType");

    const handleConfirmSubmit = async (idempotencyKey: string) => {
        if (isSending) return;
        try {
            console.log("idempotencyKey: ", idempotencyKey)
            if (!pendingFormData) return;
            setIsSending(true);

            const selectedType = pendingFormData.type;

            const formData: NewSendBulkNotification = {
                title: pendingFormData.title,
                title_es: pendingFormData.title_es,
                title_ja: pendingFormData.title_ja,
                title_zh: pendingFormData.title_zh,
                message: pendingFormData.message,
                message_es: pendingFormData.message_es,
                message_ja: pendingFormData.message_ja,
                message_zh: pendingFormData.message_zh,
                type: selectedType,
                isLink,
                isStored,
                hotspot: pendingFormData.hotspot,
                hotspotType: pendingFormData.hotspotType,
                ...(selectedType === "SINGLE" && { singleUser: pendingFormData.singleUser }),
                ...(selectedType === "MULTIPLE" && { multipleUsers: pendingFormData.multipleUsers }),
                ...(selectedType === "GROUP" && { notificationGroupId: pendingFormData.notificationGroupId }),
            };
            const res = await SendBulkNotificationAPI.create(formData, idempotencyKey);

            if (res.status) {
                toast.success(res.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
                setIsSending(false);
                fetchLatestData();
                toggleModal();
            }
        } catch (error: any) {
            setIsSending(false);
            console.log("error: ", error)
            toast.error(error.message || 'Something went wrong', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            });
        }
    };

    const languages = [
        { code: "ja", label: "Japanese" },
        { code: "zh", label: "Chinese" },
        { code: "es", label: "Spanish" },
    ];

    const toggleLanguage = (lang: string) => {
        let updated = [...selectedLangs];

        if (updated.includes(lang)) {
            updated = updated.filter((l) => l !== lang);
        } else {
            updated.push(lang);
        }

        setSelectedLangs(updated);
    };

    const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
    const [isSending, setIsSending] = useState(false);

    return (
        <div className='container mx-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            {pendingFormData && <ConfirmModel isOpen={showConfirmModal} toggleModal={() => setShowConfirmModal(!showConfirmModal)} onConfirm={handleConfirmSubmit} notificationData={pendingFormData} isSending={isSending} />}
            <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading='Send Bulk Notification'>
                <div className="w-full p-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium">Is MultiLanguage?</label>
                            <SwitchInput
                                initialValue={isMultiLanguage}
                                onChange={e => setIsMultiLanguage(e)}
                            />
                        </div>

                        {isMultiLanguage && <div className="flex items-center gap-4 mb-4">
                            {languages.map((lang) => (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedLangs.includes(lang.code)}
                                        onChange={() => toggleLanguage(lang.code)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label key={lang.code} >
                                        {lang.label}
                                    </label>
                                </div>
                            ))}
                        </div>}

                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium">Enter Notification Title</label>
                            <input
                                type="text"
                                placeholder="Enter Notification Title"
                                {...register("title", { required: true })}
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.title && (
                                <div className="text-sm text-red-600">Notification Title is required</div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium">Enter Notification Message</label>
                            <textarea
                                placeholder="Enter Notification Message"
                                {...register("message", { required: true })}
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            {errors.message && (
                                <div className="text-sm text-red-600">Notification Message is required</div>
                            )}
                        </div>

                        {selectedLangs.includes('ja') &&
                            <>
                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium">Enter Notification Title - Japanese</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Notification Title"
                                        {...register("title_ja", { required: true })}
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    {errors.title_ja && (
                                        <div className="text-sm text-red-600">Notification Title in Japanese is required</div>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium">Enter Notification Message - Japanese</label>
                                    <textarea
                                        placeholder="Enter Notification Message"
                                        {...register("message_ja", { required: true })}
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    {errors.message_ja && (
                                        <div className="text-sm text-red-600">Notification Message in Japanese is required</div>
                                    )}
                                </div>
                            </>
                        }

                        {selectedLangs.includes('zh') &&
                            <>
                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium">Enter Notification Title - Chinese</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Notification Title"
                                        {...register("title_zh", { required: true })}
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    {errors.title_zh && (
                                        <div className="text-sm text-red-600">Notification Title in Chinese is required</div>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium">Enter Notification Message - Chinese</label>
                                    <textarea
                                        placeholder="Enter Notification Message"
                                        {...register("message_zh", { required: true })}
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    {errors.message_zh && (
                                        <div className="text-sm text-red-600">Notification Message in Chinese is required</div>
                                    )}
                                </div>
                            </>
                        }

                        {selectedLangs.includes('es') &&
                            <>
                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium">Enter Notification Title - Spanish</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Notification Title"
                                        {...register("title_es", { required: true })}
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    {errors.title_zh && (
                                        <div className="text-sm text-red-600">Notification Title in Spanish is required</div>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium">Enter Notification Message - Spanish</label>
                                    <textarea
                                        placeholder="Enter Notification Message"
                                        {...register("message_es", { required: true })}
                                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                    {errors.message_es && (
                                        <div className="text-sm text-red-600">Notification Message in Spanish is required</div>
                                    )}
                                </div>
                            </>
                        }

                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium">Select Type</label>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center">
                                    <input
                                        id="single"
                                        type="radio"
                                        value="SINGLE"
                                        {...register("type", { required: true })}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="single" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Single</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="multiple"
                                        type="radio"
                                        value="MULTIPLE"
                                        {...register("type", { required: true })}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="multiple" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Multiple</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="group"
                                        type="radio"
                                        value="GROUP"
                                        {...register("type", { required: true })}

                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="group" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Group</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="allUsers"
                                        type="radio"
                                        value="ALL_USERS"
                                        {...register("type", { required: true })}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="allUsers" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">All Users</label>
                                </div>
                            </div>
                            {errors.type && (
                                <div className="text-sm text-red-600">Type is required</div>
                            )}
                        </div>

                        {type == 'SINGLE' &&
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium">Select User</label>
                                <select
                                    {...register("singleUser", { required: true })}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                >
                                    <option value="">Select User</option>
                                    {users.data.map((user) => (
                                        <option
                                            key={user.user_id}
                                            value={user.user_id}
                                        >
                                            {`${user.user_firstName} ${user.user_lastName}`}
                                        </option>
                                    ))}
                                </select>
                                {errors.singleUser && (
                                    <div className="text-sm text-red-600">User is required</div>
                                )}
                            </div>
                        }

                        {type === 'MULTIPLE' &&
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium">Select Users</label>
                                <Controller
                                    name="multipleUsers"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <Select
                                            value={userOptions.filter((opt) => field.value?.includes(opt.value))}
                                            onChange={(selectedOptions) => {
                                                const ids = selectedOptions.map((opt) => opt.value);
                                                console.log("ids", ids)
                                                field.onChange(ids);
                                            }}
                                            // {...field}
                                            options={userOptions}
                                            isMulti
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            closeMenuOnSelect={false}
                                        />
                                    )}
                                />
                                {errors.multipleUsers && (
                                    <div className="text-sm text-red-600">Users are required</div>
                                )}
                            </div>
                        }

                        {type === 'GROUP' &&
                            <div className="mb-4">
                                <label className="mb-2.5 block font-medium">Select Notification Group</label>
                                <select
                                    {...register("notificationGroupId", { required: true })}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                >
                                    <option value="">Select Notification Group</option>
                                    {notificationGroup.data.map((group) => (
                                        <option
                                            key={group.id}
                                            value={group.id}
                                        >
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.notificationGroupId && (
                                    <div className="text-sm text-red-600">Notification Group is required</div>
                                )}
                            </div>
                        }

                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium">Is Link Available?</label>
                            <SwitchInput
                                initialValue={isLink}
                                onChange={e => setIsLink(e)}
                            />
                        </div>

                        {isLink && <div className="mb-4">
                            <label className="mb-2.5 block font-medium">Select Experience type</label>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center">
                                    <input
                                        id="event"
                                        type="radio"
                                        value="event"
                                        {...register("hotspotType", { required: true })}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="event" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Event</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="place"
                                        type="radio"
                                        value="place"
                                        {...register("hotspotType", { required: true })}

                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="place" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Place</label>
                                </div>
                            </div>
                            {errors.hotspotType && (
                                <div className="text-sm text-red-600">Experience type is required</div>
                            )}
                        </div>}

                        {
                            isLink && hotspotType === 'place' &&
                            <div>
                                <label className="mb-2.5 block font-medium">Select Place</label>
                                <select
                                    {...register("hotspot", { required: true })}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                >
                                    <option value="">Select Place</option>
                                    {hotspots.data.places.map((place) => (
                                        <option
                                            key={place.id}
                                            value={place.id}
                                        >
                                            {`${place.googleLocationName}`}
                                        </option>
                                    ))}
                                </select>
                                {errors.hotspot && (
                                    <div className="text-sm text-red-600">Place is required</div>
                                )}
                            </div>
                        }
                        {
                            isLink && hotspotType === 'event' &&
                            <div>
                                <label className="mb-2.5 block font-medium">Select Event</label>
                                <select
                                    {...register("hotspot", { required: true })}
                                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                >
                                    <option value="">Select Event</option>
                                    {hotspots.data.events.map((event) => (
                                        <option
                                            key={event.id}
                                            value={event.id}
                                        >
                                            {`${event.eventName}`}
                                        </option>
                                    ))}
                                </select>
                                {errors.hotspot && (
                                    <div className="text-sm text-red-600">Event is required</div>
                                )}
                            </div>
                        }

                        <div className="mb-4">
                            <label className="mb-2.5 block font-medium">Is Stored</label>
                            <SwitchInput
                                initialValue={isStored}
                                onChange={e => setIsStored(e)}
                            />
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

export default SendBulkNotificationCU;
