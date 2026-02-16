import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseModal from '@/components/common/model';
import { IState, NewState, StateAPI } from '@/utils/api/state.api';
import { CountryAPI, CountryResponse } from '@/utils/api/country.api';

interface StateCUProps {
  isOpen: boolean;
  toggleModal: () => void;
  fetchLatestData: () => void;
  updateData?: IState;
}

const StateCU: React.FC<StateCUProps> = ({ isOpen, toggleModal, fetchLatestData, updateData }) => {
  const [countries, setCountries] = useState<CountryResponse>({ count: 0, data: [] });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewState>({
    defaultValues: updateData
      ? {
          name: updateData.name,
          countryId: updateData.countryId,
        }
      : {},
  });

  const fetchCountries = async () => {
    try {
      const res = await CountryAPI.getAll({ isActive: true });
      if (res.status) {
        setCountries(res.result);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const onSubmit = async (data: NewState) => {
    try {
      // API call for either creating or updating the State
      const res = updateData?.id
        ? await StateAPI.update(updateData.id, data)
        : await StateAPI.create(data);

      if (res.status) {
        toast.success(res.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        fetchLatestData();
        toggleModal();
      }
    } catch (error: any) {
      console.log('error: ', error);
      toast.error(error.message || 'Something went wrong', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="container mx-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading="State">
        <div className="w-full p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Input */}
            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Enter Name</label>
              <input
                type="text"
                placeholder="Enter State Name"
                {...register('name', { required: true })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.name && <div className="text-sm text-red-600">Name is required</div>}
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Country</label>
              <select
                {...register('countryId', { required: true, valueAsNumber: true })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              >
                <option value="">Select Country</option>
                {countries.data.map((country) => (
                  <option
                    key={country.id}
                    value={country.id}
                    selected={country.id === updateData?.countryId}
                  >
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.countryId && <div className="text-sm text-red-600">Country is required</div>}
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

export default StateCU;
