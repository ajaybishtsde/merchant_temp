import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PhoneMockUp from '@/static/images/logo/logoPurple.svg';
import Frame from '@/static/images/cover/Frame.svg';
import { TfiEmail } from 'react-icons/tfi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { MerchantAPI } from '@/utils/api/merchant.api';
import LoadingButton from '@/components/common/LoadingButton';

interface MerchantRegister {
  email: string;
  password: string;
  companyName: string;
  contactPerson: string;
  documents: FileList;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [isPassword, setIsPassword] = React.useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MerchantRegister>();

  const togglePassword = () => setIsPassword(!isPassword);

  const onSubmit = async (data: MerchantRegister) => {
    if (isSubmitting) return;

    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('company_name', data.companyName);
      formData.append('contact_person', data.contactPerson);
      // formData.append('documents', data.documents[0]);

      const res = await MerchantAPI.addNew(formData);

      if (res?.status) {
        toast.success('Verification email sent. Please check your inbox.', {
          autoClose: 2000,
        });

        navigate('/auth/veriyotp', {
          state: { email: data.email },
        });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Registration failed');
    } finally {
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center">
      <div className="container mx-auto rounded-sm border border-stroke bg-white shadow-default">
        <div className="flex flex-wrap items-center">
          {/* Left Illustration */}
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="flex justify-center items-center flex-col my-20 gap-19">
              <img src={PhoneMockUp} alt="phone-mockup" />
              <img src={Frame} alt="frame" />
            </div>
          </div>

          {/* Form */}
          <div className="w-full xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Merchant Sign Up
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Company Name */}
                <div className="mb-4">
                  <label className="block mb-2">Company Name</label>
                  <input
                    type="text"
                    placeholder="Enter company name"
                    {...register('companyName', { required: true })}
                    className="w-full rounded-lg border py-4 px-6"
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-600">Company name is required</p>
                  )}
                </div>
                {/* Contact Person */}
                <div className="mb-4">
                  <label className="block mb-2">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Enter contact person"
                    {...register('contactPerson', { required: true })}
                    className="w-full rounded-lg border py-4 px-6"
                  />
                  {errors.contactPerson && (
                    <p className="text-sm text-red-600">Contact person is required</p>
                  )}
                </div>
                {/* Email */}
                <div className="mb-4">
                  <label className="block mb-2">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter email"
                      {...register('email', { required: true })}
                      className="w-full rounded-lg border py-4 pl-6 pr-10"
                    />
                    <span className="absolute right-4 top-4">
                      <TfiEmail />
                    </span>
                  </div>
                  {errors.email && <p className="text-sm text-red-600">Email is required</p>}
                </div>
                {/* Password */}
                <div className="mb-4">
                  <label className="block mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={isPassword ? 'password' : 'text'}
                      placeholder="6+ Characters, 1 Capital letter"
                      {...register('password', { required: true, minLength: 6 })}
                      className="w-full rounded-lg border py-4 pl-6 pr-10"
                    />
                    <span
                      onClick={togglePassword}
                      className="absolute right-4 top-4 cursor-pointer"
                    >
                      {isPassword ? <BsEye /> : <BsEyeSlash />}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">Password must be at least 6 characters</p>
                  )}
                </div>
                <LoadingButton
                  type="submit"
                  loading={isSubmitting}
                  className="w-full rounded-lg bg-primary text-white p-4"
                >
                  {isSubmitting ? 'Creating account...' : 'Create Merchant Account'}
                </LoadingButton>

                <div className="mt-4 text-center">
                  <p className="text-sm">
                    Already have an account?{' '}
                    <Link to="/auth/login" className="text-primary font-medium hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
