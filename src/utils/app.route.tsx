import SignIn from '@/pages/Authentication/SignIn';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import Places from '@/pages/Places';
import ProfileSetting from '@/pages/ProfileSetting';
import PlaceOffer from '@/pages/PlaceOffer';
import SignUp from '@/pages/Authentication/SignUp';
import OTPVerify from '@/pages/Authentication/verifyOtp';
import ForgotPassword from '@/pages/Authentication/forgotPassword';
import AccountSettings from '@/pages/accountSettings';

export const publicRoutes = [
  { path: '/auth/login', element: <SignIn /> },
  { path: '/auth/signup', element: <SignUp /> },
  { path: '/auth/veriyotp', element: <OTPVerify /> },
  { path: '/auth/forgot-password', element: <ForgotPassword /> },
  { path: '*', element: <NotFound /> },
];

export const privateRoutes = [
  { path: '/', element: <Dashboard /> },
  { path: '/profile-setting', element: <ProfileSetting /> },
  { path: '/account-setting', element: <AccountSettings /> },
  { path: '/places', element: <Places /> },
  { path: '/place-offer', element: <PlaceOffer /> },
];
