import { create } from 'zustand';

// Default values for all user settings
const defaultUser = {
  name: 'John',
  userName: 'Dispatcher',
  country: 'Pakistan',
  selectedCountry: {
    name: 'Pakistan',
    timezone: 'Asia/Karachi',
    flag: 'https://flagcdn.com/pk.svg',
  },
  customBgColor: '#10b981',
  useFlag: true,
  timeformat: '12hr',      // '12hr' or '24hr'
  mapstatename: 'name',    // 'name', 'abbr', or 'blank'
  mode: 'light',
  truckAnimate: false,
};

// Load saved data, merging with defaults to handle missing fields
const getInitialUser = () => {
  const saved = localStorage.getItem('user-settings');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return { ...defaultUser, ...parsed };
    } catch (e) {
      console.error('Failed to parse saved settings', e);
    }
  }
  return defaultUser;
};

const useStore = create((set) => ({
  user: getInitialUser(),
  showModal: false,

  setShowModal: (value) => set({ showModal: value }),

  updateUser: (newFields) =>
    set((state) => {
      const updatedUser = { ...state.user, ...newFields };
      localStorage.setItem('user-settings', JSON.stringify(updatedUser));
      return { user: updatedUser };
    }),
}));

export default useStore;