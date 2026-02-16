import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseModal from '@/components/common/model';
import {
  IPlaceOffer,
  NewPlaceOffer,
  PlaceOfferAPI,
  PlaceResponse,
} from '@/utils/api/place-offer.api';

interface PlaceOfferCUProps {
  isOpen: boolean;
  toggleModal: () => void;
  fetchLatestData: () => void;
  updateData?: IPlaceOffer;
}

const PlaceOfferCU: React.FC<PlaceOfferCUProps> = ({
  isOpen,
  toggleModal,
  fetchLatestData,
  updateData,
}) => {
  const [places, setPlaces] = useState<PlaceResponse>({ count: 0, data: [] });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPlaceOffer>({
    defaultValues: updateData
      ? {
          place_id: updateData.place.id,
          redeem_code: updateData.redeem_code,
          description: updateData.description,
          expiry_date: updateData.expiry_date,
        }
      : {},
  });

  const fetchPlaces = async () => {
    try {
      const res = await PlaceOfferAPI.getAllPlaces({ isActive: true });
      if (res.status) {
        setPlaces(res.result);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const onSubmit = async (data: NewPlaceOffer) => {
    try {
      const res = updateData?.id
        ? await PlaceOfferAPI.update(updateData.id, data)
        : await PlaceOfferAPI.create(data);

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
      <BaseModal
        isOpen={isOpen}
        toggleModal={toggleModal}
        heading="Place Offers"
      >
        <div className="w-full p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Place</label>
              <select
                {...register('place_id', {
                  required: true,
                  valueAsNumber: true,
                })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              >
                <option value="">Select Place</option>
                {places.data.map((country) => (
                  <option
                    key={country.id}
                    value={country.id}
                    selected={country.id === updateData?.place.id}
                  >
                    {country.googleLocationName}
                  </option>
                ))}
              </select>
              {errors.place_id && (
                <div className="text-sm text-red-600">Place is required</div>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium">
                Enter Redeem code
              </label>
              <input
                type="text"
                placeholder="Enter Redem Code Name"
                {...register('redeem_code', { required: true })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.redeem_code && (
                <div className="text-sm text-red-600">
                  Redeem code is required
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium">
                Enter Description
              </label>
              <textarea
                placeholder="Enter Description"
                {...register('description', { required: true })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.description && (
                <div className="text-sm text-red-600">
                  Description is required
                </div>
              )}
            </div>

            <div className="w-full">
              <label className="mb-2.5 font-medium">Event Expiry Date</label>
              <input
                type="date"
                {...register('expiry_date', { required: true })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.expiry_date && (
                <div className="text-sm text-red-600">
                  Expiry Date is required
                </div>
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

export default PlaceOfferCU;
