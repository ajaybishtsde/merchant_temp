import { RsvpAPi, RsvpResult, RsvpUser } from '@/utils/api/rsvp.api';
import React, { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import dummyUserImage from '@/static/images/user/user_dummy.png';

type UserStatus = 'locked' | 'maybe';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99,
  },
};

interface ModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  eventId:number
}

const ViewGuestList: React.FC<ModalProps> = ({ isOpen, toggleModal,eventId }) => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<UserStatus>('locked');
  const [rsvpUsers, setRsvpUsers] = useState<RsvpResult | null>(null);
  useEffect(() => {
    const getList = async () => {
      const res = await RsvpAPi.get({ eventId });
      setRsvpUsers(res.result);
    };

    getList();
  }, []);

  const activeUsers: RsvpUser[] = useMemo(() => {
    if (!rsvpUsers) return [];

    const list =
      activeTab === 'locked' ? rsvpUsers['Locked In'] : rsvpUsers.Maybe;
    return list?.filter((user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [rsvpUsers, activeTab, search]);

  const handleProfileVisit = (id: number) => {
    toggleModal();
    navigate(`/users/${id}`, {
      state: {
        from: '/experiences',
        selectedTab: 'event',
        openGuestList: true,
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={toggleModal}
      style={customStyles}
      ariaHideApp={false}
      className="fixed inset-0 flex items-center justify-center"
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-semibold">Guest List</h3>
          <button
            onClick={toggleModal}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {(['locked', 'maybe'] as UserStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'locked'
                ? `Locked in 🫡 (${rsvpUsers?.['Locked In']?.length ?? 0})`
                : `Maybe 🤔 (${rsvpUsers?.Maybe?.length ?? 0})`}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* List */}
        <div className="px-4 py-3 overflow-y-auto flex-1">
          <ul className="space-y-3">
            {activeUsers?.length > 0 ? (
              activeUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleProfileVisit(user.id)}
                >
                  <img
                    src={user.profilePic ?? dummyUserImage}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {user.firstName} {user.lastName}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-center text-sm text-gray-500 py-6">
                No users found
              </li>
            )}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default ViewGuestList;
