import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FieldErrors,
  useForm,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { toast } from "react-toastify";
import BaseModal from "@/components/common/model";
import {
  NeighborhoodAPI,
  NeighborhoodResponse,
} from "@/utils/api/neighborhood.api";
import {
  HotspotAPI,
  IPlaceHotspot,
  NewHotspot,
  NewPlaceHotspot,
} from "@/utils/api/hotspot.api";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import debounce from "lodash.debounce";
import PlaceForm from "./PlaceForm";
import { PriceRangeAPI, PriceRangeResponse } from "@/utils/api/priceRange.api";
import { VibeTypeAPI, VibeTypeResponse } from "@/utils/api/vibeType.api";
import ButtonLoader from "@/components/common/Loader/ButtonLoader";

const libraries = ["places"];

interface HotspotCUProps {
  isOpen: boolean;
  toggleModal: () => void;
  fetchLatestData: () => void;
  updateData?: IPlaceHotspot;
}

interface GooglePlace {
  place_id: string;
  name: string;
  address: string;
  location: { latitude: number; longitude: number };
}

const HotspotCU: React.FC<HotspotCUProps> = ({
  isOpen,
  toggleModal,
  fetchLatestData,
  updateData,
}) => {
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodResponse>({
    count: 0,
    data: [],
  });
  const [place, setPlace] = useState<GooglePlace | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [priceRange, setPriceRange] = useState<PriceRangeResponse>({
    count: 0,
    data: [],
  });
  const [vibeType, setVibeType] = useState<VibeTypeResponse>({
    count: 0,
    data: [],
  });
  const [imageError, setImageError] = useState<string | null>(null);

  const autocompleteRef = useRef<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    control,
  } = useForm<NewPlaceHotspot>({
    defaultValues: {
      placeDetails: "",
    },
    shouldUnregister: true,
  });

  const hotspotType = watch("hotspotType");

  const fetchNeighborhood = async () => {
    try {
      const res = await NeighborhoodAPI.getAll({ isActive: true });
      if (res.status) {
        setNeighborhoods(res.result);
      }
      const vibe = await VibeTypeAPI.getAll({ isActive: true });
      setVibeType(vibe.result);

      const priceRange = await PriceRangeAPI.getAll({ isActive: true });
      setPriceRange(priceRange.result);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (updateData) {
      reset({
        priceRange: updateData?.priceRange?.id,
        vibeType: updateData?.vibeType?.id,
        // image: updateData?.image,
        hotspotType: updateData?.hotspotType,
        neighborhoodId: updateData?.neighborhood?.id,
        // Place type
        placeCategory: (updateData as IPlaceHotspot)?.placeCategory?.id,
        foodCategory: (updateData as IPlaceHotspot)?.foodCategory?.id,
        placeDetails: (updateData as IPlaceHotspot)?.placeDetails,
        placeOpeningHours: (updateData as IPlaceHotspot)?.placeOpeningHours,
        dealDescription: (updateData as IPlaceHotspot)?.dealDescription || "",
        isDeal: (updateData as IPlaceHotspot)?.isDeal,
      });
    }
  }, [updateData, reset]);

  useEffect(() => {
    fetchNeighborhood();
  }, []);

  const debouncedPlaceChange = useCallback(
    debounce(() => {
      if (autocompleteRef.current) {
        const place = autocompleteRef.current.getPlace();
        if (place) {
          const location = {
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          };
          setPlace({
            place_id: place.place_id,
            name: place.name,
            location,
            address: place.formatted_address,
          });
        }
      }
    }, 500),
    [],
  );

  const onLoad = (autocomplete: any) => {
    autocompleteRef.current = autocomplete;
    autocomplete.setFields([
      "place_id",
      "name",
      "formatted_address",
      "geometry",
    ]); //'international_phone_number', 'website', 'rating', 'reviews', 'opening_hours', 'types']);
  };

  const onSubmit = async (formData: NewPlaceHotspot) => {
    try {
      console.log("formData: ", formData);
      if (!formData.image && !updateData?.image) {
        setImageError("Image is required");
        return;
      }
      if (!updateData && (!place?.address || !place.place_id || !place.name)) {
        toast.error(
          "Oops! We couldn’t load location results. Please try again later.",
        );
        return;
      }
      setIsLoading(true);
      const form = new FormData();

      form.append("neighborhoodId", String(formData.neighborhoodId));
      form.append(
        "hotspotType",
        updateData?.hotspotType || formData.hotspotType || hotspotType,
      );

      if (!updateData) {
        form.append("googleLatitude", String(place?.location.latitude));
        form.append("googleLongitude", String(place?.location.longitude));
        form.append("googleLocationName", String(place?.name));
        form.append("googlePlaceId", String(place?.place_id));
        form.append("googlePlaceAddress", String(place?.address));
      }
      form.append("priceRange", String(formData.priceRange));
      form.append("vibeType", String(formData.vibeType));
      if (formData.image) {
        form.append("image", formData.image);
      }
      form.append(
        "placeCategory",
        String((formData as NewPlaceHotspot).placeCategory),
      );
      if ((formData as NewPlaceHotspot)?.foodCategory) {
        form.append(
          "foodCategory",
          String((formData as NewPlaceHotspot).foodCategory),
        );
      }
      form.append("placeDetails", (formData as NewPlaceHotspot).placeDetails);
      form.append(
        "placeOpeningHours",
        JSON.stringify((formData as NewPlaceHotspot).placeOpeningHours),
      );

      form.append("isDeal", String((formData as NewPlaceHotspot).isDeal));
      const dealDescription = (formData as NewPlaceHotspot).dealDescription;
      if (dealDescription) {
        form.append("dealDescription", dealDescription);
      }

      const res = updateData
        ? await HotspotAPI.update(updateData.id, form)
        : await HotspotAPI.create(form);

      toast.success(res.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });

      fetchLatestData();
      toggleModal();
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message || "Something went wrong", {
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
        heading="Experiences"
        customClass="md:w-[70%] w-[90%] max-h-screen min-h-screen overflow-y-auto h-auto right-0 absolute z-50"
      >
        <div className="w-full p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium">
                Select Neighborhood
              </label>
              <select
                {...register("neighborhoodId", { required: true })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Select Neighborhood</option>
                {neighborhoods.data.map((neighborhood) => (
                  <option
                    key={neighborhood.id}
                    value={neighborhood.id}
                    selected={neighborhood.id === updateData?.neighborhood?.id}
                  >
                    {`${neighborhood.name}, ${neighborhood.city}, ${neighborhood.state}, ${neighborhood.country}`}
                  </option>
                ))}
              </select>
              {errors["neighborhoodId" as keyof NewHotspot] && (
                <div className="text-sm text-red-600">
                  Neighborhood is required
                </div>
              )}
            </div>
            {!updateData && (
              <div className="mb-4">
                <label className="mb-2.5 block font-medium">
                  Enter Location Name
                </label>
                <LoadScript
                  libraries={libraries}
                  googleMapsApiKey={process.env.GOOGLE_MAP_API_KEY || ""}
                >
                  <Autocomplete
                    onLoad={onLoad}
                    onPlaceChanged={debouncedPlaceChange}
                  >
                    <input
                      {...register("googleLocationName", { required: true })}
                      type="text"
                      placeholder="Search for a place"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </Autocomplete>
                </LoadScript>

                {errors["googleLocationName" as keyof NewHotspot] && (
                  <div className="text-sm text-red-600">
                    Location Name is required
                  </div>
                )}
              </div>
            )}
            <div className="mb-4">
              <label className="mb-2.5 block font-medium">
                Select Price Range
              </label>
              <select
                {...register("priceRange")}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Select Price Range</option>
                {priceRange.data.map((price) => (
                  <option
                    key={price.id}
                    value={price.id}
                    selected={price.id === updateData?.priceRange?.id}
                  >
                    {price.range}
                  </option>
                ))}
              </select>
              {/* {errors['priceRange' as keyof NewHotspot] && (
                <div className="text-sm text-red-600">Price range is required</div>
              )} */}
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium">
                Select Vibe Type
              </label>
              <select
                {...register("vibeType")}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="">Select Vibe Type</option>
                {vibeType.data.map((vibe) => (
                  <option
                    key={vibe.id}
                    value={vibe.id}
                    selected={vibe.id === updateData?.vibeType?.id}
                  >
                    {vibe.name}
                  </option>
                ))}
              </select>
              {/* {errors['vibeType' as keyof NewHotspot] && (
                <div className="text-sm text-red-600">Vibe type is required</div>
              )} */}
            </div>

            <PlaceForm
              register={register as UseFormRegister<NewPlaceHotspot>}
              setValue={setValue as UseFormSetValue<NewPlaceHotspot>}
              watch={watch as UseFormWatch<NewPlaceHotspot>}
              errors={errors as FieldErrors<NewPlaceHotspot>}
              updateData={updateData as IPlaceHotspot}
              imageError={imageError}
              setImageError={setImageError}
              control={control}
            />
            <div className="mb-5">
              {isLoading ? (
                <ButtonLoader />
              ) : (
                <input
                  disabled={isLoading}
                  type="submit"
                  value="Submit"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              )}
            </div>
          </form>
        </div>
      </BaseModal>
    </div>
  );
};

export default HotspotCU;
