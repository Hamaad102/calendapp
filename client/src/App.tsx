import { Routes, Route } from 'react-router-dom';

// Pages
import Auth from './pages/Auth/Auth';
import Error from './pages/Error/Error';
import Dashboard from './pages/Dashboard/Dashboard';
import Availability from './pages/Availability/Availability';
import Upgrade from './pages/Upgrade/Upgrade';
import Success from './pages/Upgrade/Success/Success';
import Settings from './pages/Settings/Settings';
import Profile from './pages/Profile/Profile';
import Schedule from './pages/Schedule/Schedule';
import Book from './pages/Book/Book';
import Change from './pages/Change/Change';

// Context
import { useAuth } from './context/useAuthContext';

export default function App(): JSX.Element {
  const { loggedInUser } = useAuth();

  return (
    <Routes>
      <Route path="/" element={loggedInUser ? <Dashboard /> : <Auth />} />
      <Route path="/error" element={<Error />} />
      <Route path="/availability" element={loggedInUser ? <Availability /> : <Auth />} />
      <Route path="/upgrade" element={loggedInUser ? <Upgrade /> : <Auth />} />
      <Route path="/upgrade/success/:session" element={loggedInUser ? <Success /> : <Auth />} />
      <Route path="/settings" element={loggedInUser ? <Settings /> : <Auth />} />
      <Route path="/:url" element={<Profile />} />
      <Route path="/:url/:eventid" element={<Schedule />} />
      <Route path="/:url/:eventid/book" element={<Book />} />
      <Route path="/change/:mongoid/:googleEventId" element={<Change />} />
    </Routes>
  );
}
