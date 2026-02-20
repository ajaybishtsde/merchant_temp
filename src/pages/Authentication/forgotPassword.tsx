import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { TfiEmail } from 'react-icons/tfi';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { MerchantAPI } from '@/utils/api/merchant.api';
import LoadingButton from '@/components/common/LoadingButton';

interface EmailForm {
  email: string;
}

interface ResetForm {
  otp: string;
  password: string;
  confirmPassword: string;
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // email form
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting },
  } = useForm<EmailForm>();

  // reset form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting: isResetSubmitting },
  } = useForm<ResetForm>();

  const password = watch('password');

  const onSendOtp = async (data: EmailForm) => {
    try {
      const res = await MerchantAPI.forgotPassword(data);

      if (res?.status) {
        toast.success('OTP sent to your email');
        setEmail(data.email);
        setStep(2);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send OTP');
    }
  };

  const onResetPassword = async (data: ResetForm) => {
    try {
      const payload = {
        email,
        otp: data.otp,
        password: data.password,
      };

      const res = await MerchantAPI.resetPassword(payload);

      if (res?.status) {
        toast.success('Password reset successfully');
        navigate('/auth/login');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reset password');
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center">
      <div className="container mx-auto max-w-md rounded-sm border border-stroke bg-white shadow-default">
        <div className="p-6 sm:p-12">
          <h2 className="mb-6 text-2xl font-bold">
            {step === 1 ? 'Forgot Password' : 'Verify OTP & Reset Password'}
          </h2>

          {step === 1 && (
            <form onSubmit={handleEmailSubmit(onSendOtp)}>
              <div className="mb-6">
                <label className="mb-2.5 block font-medium">Email</label>

                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...registerEmail('email', { required: true })}
                    className="w-full rounded-lg border py-4 pl-6 pr-10"
                  />
                  <span className="absolute right-4 top-4">
                    <TfiEmail />
                  </span>
                </div>

                {emailErrors.email && (
                  <div className="text-sm text-red-600 mt-1">Email is required</div>
                )}
              </div>

              <LoadingButton
                type="submit"
                loading={isSubmitting}
                className="w-full rounded-lg bg-primary p-4 text-white"
              >
                {isSubmitting ? 'Sending...' : 'Send OTP'}
              </LoadingButton>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit(onResetPassword)}>
              <p className="text-sm text-gray-500 mb-4">
                OTP sent to <span className="font-medium">{email}</span>
              </p>

              {/* OTP */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium">Enter OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="6 digit OTP"
                  {...register('otp', { required: true, minLength: 6 })}
                  className="w-full rounded-lg border py-4 px-6"
                />
                {errors.otp && <div className="text-sm text-red-600 mt-1">Valid OTP required</div>}
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium">New Password</label>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    {...register('password', {
                      required: true,
                      minLength: 6,
                    })}
                    className="w-full rounded-lg border py-4 pl-6 pr-10"
                  />

                  <span
                    className="absolute right-4 top-4 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <BsEyeSlash /> : <BsEye />}
                  </span>
                </div>

                {errors.password && (
                  <div className="text-sm text-red-600 mt-1">Minimum 6 characters required</div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="mb-2.5 block font-medium">Confirm Password</label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    {...register('confirmPassword', {
                      required: true,
                      validate: (value) => value === password || 'Passwords do not match',
                    })}
                    className="w-full rounded-lg border py-4 pl-6 pr-10"
                  />

                  <span
                    className="absolute right-4 top-4 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                  </span>
                </div>

                {errors.confirmPassword && (
                  <div className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</div>
                )}
              </div>

              <LoadingButton
                type="submit"
                loading={isResetSubmitting}
                className="w-full rounded-lg bg-primary p-4 text-white"
              >
                {isResetSubmitting ? 'Resetting...' : 'Reset Password'}
              </LoadingButton>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
