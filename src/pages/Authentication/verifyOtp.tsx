import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { MerchantAPI } from '@/utils/api/merchant.api';
import LoadingButton from '@/components/common/LoadingButton';

interface OTPForm {
  otp: string;
}

const OTPVerify: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [timer, setTimer] = React.useState(60);
  const [canResend, setCanResend] = React.useState(false);
  const [resentMessage, setResentMessage] = React.useState('');
  const [resendLoading, setResendLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OTPForm>();

  // countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const onSubmit = async (data: OTPForm) => {
    try {
      const payload = {
        email,
        otp: data.otp,
      };

      const result = await MerchantAPI.verifyEmailOtp(payload);
      if (result?.status) {
        toast.success('OTP Verified');
        navigate('/auth/login');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Invalid OTP');
    }
  };

  const handleResend = async () => {
    if (!canResend || resendLoading) return;

    try {
      setResendLoading(true);

      const result = await MerchantAPI.resendOtp({ email });

      if (result?.status) {
        setResentMessage('OTP resent successfully');
        toast.success('OTP resent');

        setTimer(30);
        setCanResend(false);

        setTimeout(() => setResentMessage(''), 3000);
      }
    } catch (err) {
      toast.error('Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center">
      <div className="container mx-auto max-w-md rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-6 sm:p-12">
          <h2 className="mb-3 text-2xl font-bold text-black dark:text-white">Verify OTP</h2>

          {email && (
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              OTP sent to <span className="font-medium">{email}</span>
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Enter OTP
              </label>

              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6 digit OTP"
                {...register('otp', { required: true, minLength: 6 })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />

              {errors.otp && <div className="text-sm text-red-600 mt-1">Valid OTP is required</div>}
            </div>

            <LoadingButton
              type="submit"
              loading={isSubmitting}
              className="w-full rounded-lg border border-primary bg-primary p-4 text-white hover:bg-opacity-90"
            >
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </LoadingButton>
          </form>
          <div className="text-center mt-4 text-sm">
            {resentMessage && (
              <p className="text-green-600 text-sm text-center mt-3">{resentMessage}</p>
            )}

            {canResend ? (
              <LoadingButton
                type="button"
                loading={resendLoading}
                onClick={handleResend}
                className="w-full text-primary font-medium hover:underline"
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </LoadingButton>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Resend OTP in {timer}s</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OTPVerify;
