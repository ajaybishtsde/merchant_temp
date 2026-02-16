import React from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneMockUp from '@/static/images/logo/logoPurple.svg';
import Frame from '@/static/images/cover/Frame.svg';
import { TfiEmail } from 'react-icons/tfi';
import { useCurrentUser } from '@/context/userContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { AdminAPI, AdminLogin } from '@/utils/api/admin.api';


const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [isPassword, setIsPassword] = React.useState<boolean>(true);
  const { currentUser, setCurrentUser } = useCurrentUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLogin>();

  React.useEffect(() => {
    if (currentUser && currentUser.token) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const onSubmit = async (data: AdminLogin) => {
    try {
      const res = await AdminAPI.login(data);
      console.log('res', res)
      if (res) {
        toast.success("user logged-in successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        localStorage.setItem("admin", JSON.stringify(res.result));
        setCurrentUser(res.result);
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };

  const togglePassword = () => {
    setIsPassword(!isPassword);
  };

  return (
    <section className='min-h-screen h-full flex justify-center items-center'>
      <div className=" container mx-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="flex justify-center items-center flex-col my-20 gap-19">
              <img src={PhoneMockUp} alt="phone-mockup" />
              <img src={Frame} alt="phone-mockup" />
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to Admin
              </h2>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      {...register("email", { required: true })}
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <TfiEmail />
                    </span>
                  </div>
                  {errors.email && (
                    <div className="text-sm text-red-600">Email is required</div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Re-type Password
                  </label>
                  <div className="relative">
                    <input
                      type={isPassword ? "password" : "text"}
                      placeholder="6+ Characters, 1 Capital letter"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      {...register("password", { required: true })}
                    />

                    <span className="absolute right-4 top-4 cursor-pointer" onClick={togglePassword}>
                      {isPassword ? <BsEye /> : <BsEyeSlash />}
                    </span>
                  </div>
                  {errors.password && (
                    <div className="text-sm text-red-600">Password is required</div>
                  )}
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
