import Admin from '@/pages/Admin';
import SignIn from '@/pages/Authentication/SignIn';
import Dashboard from '@/pages/Dashboard';
import InterestList from '@/pages/interests';
import NeighborhoodList from '@/pages/Neighborhood';
import NotFound from '@/pages/NotFound';
import UserList from '@/pages/Users';
import OpenTo from '@/pages/OpenTo';
import RomanceType from '@/pages/RomanceType';
import GenderType from '@/pages/GenderType';
import OrientationType from '@/pages/OrientationType';
import PronounsType from '@/pages/PronoundType';
import HotspotList from '@/pages/Hotspot';
import Report from '@/pages/Report';
import EventType from '@/pages/EventType';
import VibeType from '@/pages/VibeType';
import FoodCategory from '@/pages/FoodCategory';
import PlaceCategory from '@/pages/PlaceCategory';
import PriceRange from '@/pages/PriceRange';
import AppPassword from '@/pages/AppPassword';
import AdminMessage from '@/pages/AdminMessage';
import NotificationGroup from '@/pages/NotificationGroup';
import SendBulkNotification from '@/pages/SendBulkNotification';
import BlockList from '@/pages/BlockedUsers';
import ProfileSetting from '@/pages/ProfileSetting';
import AppVersion from '@/pages/AppVersion';
import WaitList from '@/pages/Waitlist';
import Country from '@/pages/Country';
import State from '@/pages/State';
import City from '@/pages/City';
import UserProfile from '@/pages/UserProfile';
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
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/accounts-created', element: <UserList /> },
  { path: '/admin', element: <Admin /> },
  { path: '/reported-user', element: <Report /> },
  { path: '/blocked-user', element: <BlockList /> },
  { path: '/profile-setting', element: <ProfileSetting /> },
  { path: '/account-setting', element: <AccountSettings /> },
  { path: 'neighborhood', element: <NeighborhoodList /> },
  { path: '/experiences', element: <HotspotList /> },
  { path: '/interests', element: <InterestList /> },
  { path: '/open-to-options', element: <OpenTo /> },
  { path: '/romance-type', element: <RomanceType /> },
  { path: '/gender-type', element: <GenderType /> },
  { path: '/orientation-type', element: <OrientationType /> },
  { path: '/pronouns-type', element: <PronounsType /> },
  { path: '/event-type', element: <EventType /> },
  { path: '/place-category', element: <PlaceCategory /> },
  { path: '/food-category', element: <FoodCategory /> },
  { path: '/price-range', element: <PriceRange /> },
  { path: '/vibe-type', element: <VibeType /> },
  { path: '/app-version', element: <AppVersion /> },
  { path: '/app-data/open-to-options', element: <OpenTo /> },
  { path: '/app-data/romance-type', element: <RomanceType /> },
  { path: '/app-data/gender-type', element: <GenderType /> },
  { path: '/app-data/orientation-type', element: <OrientationType /> },
  { path: '/app-data/pronouns-type', element: <PronounsType /> },
  { path: '/country', element: <Country /> },
  { path: '/state', element: <State /> },
  { path: '/city', element: <City /> },
  { path: '/app-password', element: <AppPassword /> },
  { path: '/admin-message', element: <AdminMessage /> },
  { path: '/notification-group', element: <NotificationGroup /> },
  { path: '/send-bulk-notification', element: <SendBulkNotification /> },
  { path: '/waitlist', element: <WaitList /> },
  { path: '/users/:id', element: <UserProfile /> },
  { path: '/place-offer', element: <PlaceOffer /> },
];
