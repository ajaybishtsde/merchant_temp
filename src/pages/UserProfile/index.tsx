import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import DefaultLayout from '@/layout/DefaultLayout';
import { UserAPI, UserProfileResult } from '@/utils/api/user.api';
import dummyUserImage from '@/static/images/user/user_dummy.png';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.from || '/experiences';
  const selectedTab = location.state?.selectedTab;

  const [user, setUser] = useState<UserProfileResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/experiences');
      return;
    }
    const fetchUser = async () => {
      setLoading(true);
      const user = await UserAPI.getUserProfile(id);
      console.log('>>>>>>>.user', user);
      setUser(user?.result);
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <DefaultLayout>
        <p className="text-center mt-16 text-lg">Loading profile...</p>
      </DefaultLayout>
    );
  }

  if (!user) {
    return (
      <DefaultLayout>
        <p className="text-center mt-16 text-red-500 text-lg">User not found</p>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="p-8">
        <BreadCrumb pageName="User Profile" />

        {/* BACK BUTTON */}
        <button
          onClick={() =>
            navigate(returnTo, {
              state: {
                selectedTab,
                reopenGuestList: true,
              },
            })
          }
          className="mb-8 text-blue-600 text-lg font-semibold hover:underline"
        >
          ← Back to Event
        </button>

        {/* PROFILE */}
        <div className="mt-10 flex flex-col items-center text-center">
          <img
            src={user?.profilePic ? user.profilePic : dummyUserImage}
            alt="Image"
            className="w-56 h-56 rounded-full object-cover shadow-lg mx-auto"
          />

          <h2 className="mt-6 text-3xl font-bold text-gray-800">{user?.firstName}</h2>

          {/* Dropped In (API driven) */}
          {user?.isDropIn && (
            <span className="mt-3 px-4 py-2 bg-green-100 text-green-700 rounded-full text-lg font-semibold">
              ✅ Dropped In
            </span>
          )}

          <p className="mt-4 text-lg text-gray-600">
            🎂 DOB:
            <span className="font-medium">{new Date(user?.dob).toLocaleDateString()}</span>
          </p>

          <p className="mt-2 text-lg text-gray-500">📞 {user?.phoneNumber}</p>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UserProfile;
