import { FoodCategoryAPI, FoodCategoryResponse } from '@/utils/api/foodCategory.api';
import { IPlaceHotspot, NewPlaceHotspot } from '@/utils/api/hotspot.api';
import { PlaceCategoryAPI, PlaceCategoryResponse } from '@/utils/api/placeCategory.api';
import { IUser, UserAPI } from '@/utils/api/user.api';
import React, { useEffect, useState } from 'react';
import {
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { MentionsInput, Mention } from 'react-mentions';

export const mentionStyles = {
  control: {
    fontSize: 14,
    fontFamily: 'inherit',
  },
  input: {
    padding: '16px 40px 16px 24px',
    color: '#050505ff',
    WebkitFontSmoothing: 'antialiased',
  },
  highlighter: {
    padding: '16px 40px 16px 24px',
    color: '#050505ff',
    backgroundColor: 'transparent',
  },
  suggestions: {
    list: {
      color: '#7389adff',
    },
    item: {
      padding: '5px 15px',
      borderBottom: '1px solid rgba(0,0,0,0.15)',
    },
  },
};

interface PlaceFormProps {
  register: UseFormRegister<NewPlaceHotspot>;
  errors: FieldErrors<NewPlaceHotspot>;
  setValue: UseFormSetValue<NewPlaceHotspot>;
  watch: UseFormWatch<NewPlaceHotspot>;
  updateData: IPlaceHotspot;
  imageError: string | null;
  setImageError: any;
  control: any;
}

const PlaceForm = ({
  register,
  errors,
  setValue,
  watch,
  updateData,
  imageError,
  setImageError,
  control,
}: PlaceFormProps) => {
  const [placeCategories, setPlaceCategories] = useState<PlaceCategoryResponse>({
    count: 0,
    data: [],
  });
  const [foodCategories, setFoodCategories] = useState<FoodCategoryResponse>({
    count: 0,
    data: [],
  });
  const [previewImage, setPreviewImage] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file as any, { shouldValidate: true });
      setPreviewImage(URL.createObjectURL(file));
      setImageError(null);
    }
  };

  useEffect(() => {
    defaultOpeningHours.forEach((item, index) => {
      setValue(`placeOpeningHours.${index}.day`, item.day);
    });
  }, [setValue]);

  const isDealAvailable = watch('isDeal');

  const defaultOpeningHours = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ].map((day) => ({
    day,
    open: '',
    close: '',
    enabled: false,
  }));

  const fetchCategory = async () => {
    try {
      const [placeRes, foodRes] = await Promise.all([
        PlaceCategoryAPI.getAll({ isActive: true }),
        FoodCategoryAPI.getAll({ isActive: true }),
      ]);
      if (placeRes.status) setPlaceCategories(placeRes.result);
      if (foodRes.status) setFoodCategories(foodRes.result);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchUsers = async (query: string, callback: any) => {
    if (!query) return;

    // Filter users based on the query typed after the '@' symbol
    const res = await UserAPI.all({ name: query });

    // Call the callback function with the filtered data
    callback(
      res.result.data.map((user: IUser) => ({
        id: user.user_id,
        display: `${user.user_firstName} ${user.user_lastName}`,
      })),
    );
  };

  return (
    <div>
      <div>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium">Place Category</label>
          <select
            {...register('placeCategory')}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          >
            <option value="">Select Place Category</option>
            {placeCategories.data.map((place) => (
              <option
                key={place.id}
                value={place.id}
                selected={place.id === updateData?.placeCategory?.id}
              >
                {place.name}
              </option>
            ))}
          </select>
          {/* {errors['placeCategory' as keyof NewPlaceHotspot] && (
                        <div className="text-sm text-red-600">Place Category is required</div>
                    )} */}
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium">Food Category</label>
          <select
            {...register('foodCategory')}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
          >
            <option value="">Select Food Category</option>
            {foodCategories.data.map((food) => (
              <option
                key={food.id}
                value={food.id}
                selected={food.id === updateData?.foodCategory?.id}
              >
                {food.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2.5 block font-medium">Place Details</label>
          <Controller
            name="placeDetails"
            control={control}
            render={({ field }) => (
              <MentionsInput
                {...field}
                value={field.value ?? ''}
                placeholder="Enter Place Details and use @ to mention users..."
                style={mentionStyles}
              >
                <Mention
                  trigger="@"
                  data={fetchUsers}
                  displayTransform={(id, display) => `@${display}`}
                />
              </MentionsInput>
            )}
          />

          {/* {errors['placeDetails' as keyof NewPlaceHotspot] && (
                        <div className="text-sm text-red-600">Place Details is required</div>
                    )} */}
        </div>

        <div className="mb-6">
          <label className="mb-2.5 block font-medium">Upload Place Image</label>
          {(previewImage || updateData?.image) && (
            <div className="mb-4">
              <img
                src={previewImage || updateData?.image}
                alt="Place"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
          {imageError && <p className="text-red-500 text-sm mt-2">{imageError}</p>}
        </div>

        {defaultOpeningHours.map((item, index) => {
          const isEnabled = watch(`placeOpeningHours.${index}.enabled`);
          return (
            <div key={item.day} className="mb-4">
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register(`placeOpeningHours.${index}.enabled`)}
                  onChange={(e) =>
                    setValue(`placeOpeningHours.${index}.enabled`, e.target.checked, {
                      shouldValidate: true,
                    })
                  }
                />
                <label className="text-sm">Open on {item.day}?</label>
              </div>
              {isEnabled && (
                <div>
                  <label className="mb-2.5 block">Opening Hours for {item.day}</label>
                  <div className="flex gap-4">
                    <input
                      type="time"
                      {...register(`placeOpeningHours.${index}.open`, {
                        required: 'Opening time is required',
                      })}
                      onChange={(e) =>
                        setValue(`placeOpeningHours.${index}.open`, e.target.value, {
                          shouldValidate: true,
                        })
                      }
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 px-4 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                    <input
                      type="time"
                      {...register(`placeOpeningHours.${index}.close`, {
                        required: 'Closing time is required',
                      })}
                      onChange={(e) =>
                        setValue(`placeOpeningHours.${index}.close`, e.target.value, {
                          shouldValidate: true,
                        })
                      }
                      className="w-full rounded-lg border border-stroke bg-transparent py-2 px-4 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    />
                  </div>
                  <div className="flex gap-4">
                    {(errors?.placeOpeningHours?.[index]?.open ||
                      errors?.placeOpeningHours?.[index]?.close) && (
                      <p className="text-sm text-red-600">
                        {errors.placeOpeningHours?.[index]?.open?.message ||
                          errors.placeOpeningHours?.[index]?.close?.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <input type="checkbox" {...register('isDeal', { required: false })} />
        <label className="text-sm">Is Deal Available?</label>
      </div>

      {isDealAvailable && (
        <div className="mb-4">
          <label className="mb-2.5 block font-medium">Deal description</label>
          <textarea
            placeholder="Enter Deal description"
            {...register('dealDescription', { required: true })}
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />
          {errors['dealDescription' as keyof NewPlaceHotspot] && (
            <div className="text-sm text-red-600">Deal Description is required</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaceForm;
