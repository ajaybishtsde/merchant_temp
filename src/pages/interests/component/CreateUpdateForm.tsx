import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseModal from '@/components/common/model';
import SwitchInput from '@/components/ui/Switch';
import { IInterest, InterestAPI, NewInterest } from '@/utils/api/interests.api';

interface CreateUpdateFormProps {
  isOpen: boolean;
  toggleModal: () => void;
  fetchLatestData: () => void;
  updateData?: IInterest;
}

const CreateUpdateForm: React.FC<CreateUpdateFormProps> = ({ isOpen, toggleModal, fetchLatestData, updateData }) => {

  const { register, handleSubmit, formState: { errors } } = useForm<NewInterest>({
    defaultValues: updateData || {}
  });
  const [isActive, setIsActive] = useState(updateData?.isActive ?? true)
  const [isTopInterest, setIsTopInterest] = useState(updateData?.isTopInterest ?? true)

  const inputFields = [
    { label: 'Name', name: 'name', placeholder: 'Enter Interest name', type: 'text' },
  ];

  const onSubmit = async (data: NewInterest) => {
    const formData = {
      name: data.name,
      isActive,
      isTopInterest
    };
    try {
      const res = updateData ? await InterestAPI.update(updateData.id, formData) : await InterestAPI.create(formData);

      toast.success(res.message, { position: toast.POSITION.TOP_RIGHT, autoClose: 1000 });
      fetchLatestData();
      toggleModal();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong', { position: toast.POSITION.TOP_RIGHT, autoClose: 1000 });
    }
  };

  return (
    <div className='container mx-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
      <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading='Interest'>
        <div className="w-full p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            {inputFields.map(({ label, name, placeholder, type }) => (
              <div className="mb-4" key={name}>
                <label className="mb-2.5 block font-medium">Enter {label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  {...register(name as keyof NewInterest, { required: true })}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                {errors[name as keyof NewInterest] && (
                  <div className="text-sm text-red-600">{label} is required</div>
                )}
              </div>
            ))}

            <div className="mb-4">
              <p className='mb-2 block font-medium'>Is this top Interest</p>
              <SwitchInput
                initialValue={isTopInterest}
                onChange={e => setIsTopInterest(e)}
              />
            </div>

            <div className="mb-4">
              <p className='mb-2 block font-medium'>Is Active</p>
              <SwitchInput
                initialValue={isActive}
                onChange={e => setIsActive(e)}
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
        {/* </div> */}
      </BaseModal >
    </div >
  );
};

export default CreateUpdateForm;
