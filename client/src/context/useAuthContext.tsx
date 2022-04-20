import { useState, useContext, createContext, FunctionComponent, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AuthApiDataSuccess } from '../interface/AuthApiData';

// API Calls
import { login, demo, logout_call, save_availability } from '../interface/Settings';

interface LoggedInUser {
  username: string;
  email: string;
  serviceid: string;
  strategy: string;
  mongoid: string;
}

interface IAuthContext {
  loggedInUser: LoggedInUser | null | undefined;
  premium: boolean;
  stripeid: string;
  url: string;
  timezone: string;
  hours: Array<string>;
  days: Array<string>;
  picture: string;
  events: Array<string>;
  schedule: Array<string>;
  updateLoginContext: (data: AuthApiDataSuccess) => void;
  updateTimezone: (timezone: string) => void;
  updateUrl: (url: string) => void;
  updateProfile: (url: string, timezone: string) => void;
  updateAvailability: (hours: Array<string>, days: Array<string>) => void;
  updatePremium: (paymentid: string) => void;
  updatePicture: (url: string) => void;
  updateEvents: (newEvents: Array<string>) => void;
  updateScheduleContext: (newSchedule: Array<string>) => void;
  logout: () => void;
  setDemo: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  loggedInUser: undefined,
  premium: false,
  stripeid: '',
  url: '',
  timezone: '',
  hours: [],
  days: [],
  picture: '',
  events: [],
  schedule: [],
  updateLoginContext: () => null,
  updateTimezone: () => null,
  updateUrl: () => null,
  updateProfile: () => null,
  updateAvailability: () => null,
  updatePremium: () => null,
  updatePicture: () => null,
  updateEvents: () => null,
  updateScheduleContext: () => null,
  logout: () => null,
  setDemo: () => null,
});

export const AuthProvider: FunctionComponent = ({ children }): JSX.Element => {
  const urlSearch = useParams().url;

  // default undefined before loading, once loaded provide user or null if logged out
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null | undefined>();

  const [premium, setPremium] = useState<boolean>(false);
  const [stripeid, setStripeid] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [timezone, setTimezone] = useState<string>('');
  const [hours, setHours] = useState<Array<string>>([]);
  const [days, setDays] = useState<Array<string>>([]);
  const [picture, setPicture] = useState<string>('');
  const [events, setEvents] = useState<Array<string>>([]);
  const [schedule, setSchedule] = useState<Array<string>>([]);

  const updateLoginContext = useCallback((data: AuthApiDataSuccess) => {
    const {
      username,
      email,
      serviceid,
      strategy,
      mongoid,
      premium,
      stripeid,
      url,
      hours,
      days,
      picture,
      events,
      schedule,
      timezone,
    } = data.user;
    setPremium(premium);
    setStripeid(stripeid);
    setUrl(url);
    setHours(hours);
    setDays(days);
    setPicture(picture);
    setEvents(events);
    setTimezone(timezone);
    setSchedule(schedule);
    setLoggedInUser({ username, email, serviceid, strategy, mongoid });
  }, []);

  const setDemo = () => {
    demo().then((res) => {
      const {
        username,
        email,
        serviceid,
        strategy,
        mongoid,
        premium,
        stripeid,
        url,
        hours,
        days,
        picture,
        events,
        schedule,
        timezone,
      } = res.data.user;
      setPremium(premium);
      setStripeid(stripeid);
      setUrl(url);
      setHours(hours);
      setDays(days);
      setPicture(picture);
      setEvents(events);
      setTimezone(timezone);
      setSchedule(schedule);
      setLoggedInUser({ username, email, serviceid, strategy, mongoid });
    });
  };

  const updateTimezone = (timezone: string) => setTimezone(timezone);

  const updateUrl = (url: string) => setUrl(url);

  const updateProfile = (url: string, timezone: string) => {
    setUrl(url);
    setTimezone(timezone);
  };

  const updatePicture = (url: string) => setPicture(url);

  const updateAvailability = (hours: Array<string>, days: Array<string>) => {
    setHours(hours);
    setDays(days);
    save_availability(loggedInUser?.mongoid, url, timezone, hours, days);
  };

  const updatePremium = (paymentid: string) => {
    setPremium(true);
    setStripeid(paymentid);
  };

  const updateEvents = (newEvents: Array<string>) => {
    setEvents(newEvents);
  };

  const logout = () => {
    // needed to remove token cookie
    logout_call()
      .then(() => {
        setLoggedInUser(null);
        setPremium(false);
        setStripeid('');
        setUrl('');
        setHours([]);
        setDays([]);
        setPicture('');
        setEvents([]);
        setSchedule([]);
      })
      .catch((error) => console.error(error));
  };

  const updateScheduleContext = (newSchedule: Array<string>) => {
    setSchedule(newSchedule);
  };

  // use our cookies to check if we can login straight away
  useEffect(() => {
    if (urlSearch === undefined) {
      login()
        .then((res) => {
          if (res.data.success) updateLoginContext(res.data.success);
          else setLoggedInUser(null);
        })
        .catch(() => ({
          error: { message: 'Unable to connect to server. Please try again' },
        }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateLoginContext]);

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        premium,
        stripeid,
        url,
        timezone,
        hours,
        days,
        picture,
        events,
        schedule,
        updateLoginContext,
        updateTimezone,
        updateUrl,
        updateProfile,
        updateAvailability,
        updatePremium,
        updatePicture,
        updateEvents,
        updateScheduleContext,
        logout,
        setDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): IAuthContext {
  return useContext(AuthContext);
}
