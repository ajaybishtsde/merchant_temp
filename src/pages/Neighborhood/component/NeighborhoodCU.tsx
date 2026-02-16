import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseModal from '@/components/common/model';
import { INeighborhood, NeighborhoodAPI, NewNeighborhood } from '@/utils/api/neighborhood.api';
import GeoFenceComponent from '@/components/Map/GeoFenceComponent';
import { StateAPI, StateResponse } from '@/utils/api/state.api';
import { CountryAPI, CountryResponse } from '@/utils/api/country.api';
import { CityAPI, CityResponse } from '@/utils/api/city.api';

interface StateWiseRateCUProps {
  isOpen: boolean;
  toggleModal: () => void;
  fetchLatestData: () => void;
  updateData?: INeighborhood;
}

const StateWiseRateCU: React.FC<StateWiseRateCUProps> = ({ isOpen, toggleModal, fetchLatestData, updateData }) => {
  const [countries, setCountries] = useState<CountryResponse>({ count: 0, data: [] });
  const [states, setStates] = useState<StateResponse>({ count: 0, data: [] });
  const [cities, setCity] = useState<CityResponse>({ count: 0, data: [] });

  const { register, handleSubmit, formState: { errors } } = useForm<NewNeighborhood>({
    defaultValues: updateData
      ? {
        name: updateData.name,
        cityId: updateData.cityId,
        stateId: updateData.stateId,
        countryId: updateData.countryId,
        location: updateData.location?.coordinates[0] || [],
        isActive: updateData.isActive,
      }
      : {}
  });

  const [location, setLocation] = useState<[number, number][]>([])

  const fetchCountries = async () => {
    try {
      const res = await CountryAPI.getAll({ isActive: true })
      if (res.status) {
        setCountries(res.result)
      }
    } catch (error) {
      console.log("error: ", error)
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  useEffect(() => {
    if (!updateData) return;
    if (updateData.countryId) {
      fetchStatesById(updateData.countryId);
    }
  }, [updateData]);

  useEffect(() => {
    if (!updateData) return;
    if (updateData.stateId) {
      fetchCitiesById(updateData.stateId);
    }
  }, [updateData]);

  const fetchStates = (e: any) => fetchStatesById(Number(e.target.value));
  const fetchCities = (e: any) => fetchCitiesById(Number(e.target.value));

  const fetchStatesById = async (countryId: number) => {
    try {
      setCity({ count: 0, data: [] })
      const res = await StateAPI.getAll({ isActive: true, countryId })
      if (res.status) {
        setStates(res.result)
      }
    } catch (error) {
      console.log("error: ", error)
    }
  }

  const fetchCitiesById = async (stateId?: number, countryId?: number) => {
    try {
      const res = await CityAPI.getAll({ isActive: true, stateId, countryId })
      if (res.status) {
        setCity(res.result)
      }
    } catch (error) {
      console.log("error: ", error)
    }
  }

  const onSubmit = async (data: NewNeighborhood) => {
    if (!updateData && (!location || location.length === 0)) {
      toast.error('Location is required', { position: toast.POSITION.TOP_RIGHT, autoClose: 1000 });
      return;
    }
    const formData: NewNeighborhood = {
      name: data.name,
      location,
      cityId: data.cityId,
      stateId: data.stateId,
      countryId: data.countryId
    };
    try {
      const res = updateData ? await NeighborhoodAPI.update(updateData.id, formData) : await NeighborhoodAPI.create(formData);

      toast.success(res.message, { position: toast.POSITION.TOP_RIGHT, autoClose: 1000 });
      fetchLatestData();
      toggleModal();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong', { position: toast.POSITION.TOP_RIGHT, autoClose: 1000 });
    }
  };

  return (
    <div className='container mx-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
      <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading='Neighborhood' customClass="md:w-[70%] w-[90%] max-h-screen min-h-screen overflow-y-auto h-auto right-0 absolute z-50">
        <div className="w-full p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Enter Neighborhood Name</label>
              <input
                type="text"
                placeholder="Enter Neighborhood Name"
                {...register("name", { required: true })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors['name' as keyof NewNeighborhood] && (
                <div className="text-sm text-red-600">Neighborhood is required</div>
              )}
            </div>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Select Location</label>
              <GeoFenceComponent setMapCoordinates={setLocation} updateData={updateData} />

              {!location && (
                <div className="text-sm text-red-600">Location is required</div>
              )}
            </div>


            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Country</label>
              <select
                {...register("countryId", { required: true, valueAsNumber: true, onChange: fetchStates })}
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
              {errors.countryId && (
                <div className="text-sm text-red-600">Country is required</div>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium">State</label>
              <select
                {...register("stateId", { required: true, valueAsNumber: true, onChange: fetchCities })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              >
                <option value="">Select State</option>
                {states.data.map((state) => (
                  <option
                    key={state.id}
                    value={state.id}
                    selected={state.id === updateData?.stateId}
                  >
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.stateId && (
                <div className="text-sm text-red-600">State is required</div>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium">City</label>
              <select
                {...register("cityId", { required: true, valueAsNumber: true })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              >
                <option value="">Select City</option>
                {cities.data.map((city) => (
                  <option
                    key={city.id}
                    value={city.id}
                    selected={city.id === updateData?.cityId}
                  >
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.cityId && (
                <div className="text-sm text-red-600">City is required</div>
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
      </BaseModal >
    </div >
  );
};

export default StateWiseRateCU;
