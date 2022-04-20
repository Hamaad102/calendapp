import moment from 'moment-timezone';
import { useState, useContext, createContext, FunctionComponent } from 'react';

// API Calls
import { retrieve_user } from '../interface/Profile';

interface EventObject {
  start: string;
  end: string;
}

interface IProfileContext {
  load: boolean;
  error: string;
  mongoid: string;
  timezone: string;
  hours: Array<string>;
  days: Array<string>;
  picture: string;
  events: Array<string>;
  username: string;
  selectedEvent: Array<string>;
  validUser: (url: string) => void;
  updateSelectedDayContext: (day?: Date) => void;

  // This state is related to the user looking to book a meeting
  selectedDay: Date | undefined;
  setSelectedEventContext: (event: string) => void;
  selectedTime: string;
  setSelectedTimeContext: (time: string) => void;
  userTimezone: string;
  setUserTimezoneContext: (timezone: string) => void;
  ownersScheduledEvents: Array<EventObject>;
  setOwnersScheduledEventsContext: (events: Array<EventObject>) => void;
  eventsRetrieved: boolean;
  setEventsRetrievedContext: (bool: boolean) => void;
  mobileContinue: boolean;
  setMobileContinueContext: (bool: boolean) => void;

  setUserActionsDefault: () => void;
}

export const ProfileContext = createContext<IProfileContext>({
  load: true,
  error: '',
  mongoid: '',
  timezone: '',
  hours: [],
  days: [],
  picture: '',
  events: [],
  username: '',
  selectedEvent: [],
  validUser: () => null,
  setSelectedEventContext: () => null,

  // This state is related to the user looking to book a meeting
  selectedDay: undefined,
  updateSelectedDayContext: () => null,
  selectedTime: '',
  setSelectedTimeContext: () => null,
  userTimezone: moment.tz.guess(),
  setUserTimezoneContext: () => null,
  ownersScheduledEvents: [],
  setOwnersScheduledEventsContext: () => null,
  eventsRetrieved: false,
  setEventsRetrievedContext: () => null,
  mobileContinue: false,
  setMobileContinueContext: () => null,

  setUserActionsDefault: () => null,
});

export const ProfileProvider: FunctionComponent = ({ children }): JSX.Element => {
  const [mongoid, setMongoid] = useState<string>('');
  const [timezone, setTimezone] = useState<string>('');
  const [hours, setHours] = useState<Array<string>>([]);
  const [days, setDays] = useState<Array<string>>([]);
  const [picture, setPicture] = useState<string>('');
  const [events, setEvents] = useState<Array<string>>([]);
  const [username, setUsername] = useState<string>('');

  const [load, setLoad] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // This is the event, 15 minute or 30 minute meeting for example
  const [selectedEvent, setSelectedEvent] = useState<Array<string>>([]);

  // This state is related to the user looking to book a meeting
  const [userTimezone, setUserTimezone] = useState<string>(moment.tz.guess());

  // This is the day the user selected on the calendar
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);

  // When the user selects a day this array is populated with the events on the owners calendar
  const [ownersScheduledEvents, setOwnersScheduledEvents] = useState<Array<EventObject>>([]);

  // Display the Time component once the owners schedule is retrieved
  const [eventsRetrieved, setEventsRetrieved] = useState<boolean>(false);

  const [mobileContinue, setMobileContinue] = useState<boolean>(false);

  // Time slot selected by user
  const [selectedTime, setSelectedTime] = useState<string>('');

  const validUser = (url: string) => {
    retrieve_user(url)
      .then((res) => {
        const { _id, days, events, hours, picture, timezone, username } = res.data;
        setMongoid(_id);
        setTimezone(timezone);
        setHours(hours);
        setDays(days);
        setPicture(picture);
        setEvents(events);
        setUsername(username);
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        setError(err.response.data);
      });
  };

  const setSelectedEventContext = (event: string) => setSelectedEvent(event.split('/'));

  // Related to user decisions

  const updateSelectedDayContext = (day: Date | undefined) => setSelectedDay(day);

  const setUserTimezoneContext = (timezone: string) => setUserTimezone(timezone);

  const setOwnersScheduledEventsContext = (events: Array<EventObject>) => {
    setOwnersScheduledEvents(events);
    setEventsRetrieved(true);
  };

  const setEventsRetrievedContext = (bool: boolean) => {
    setEventsRetrieved(bool);
  };

  const setMobileContinueContext = (bool: boolean) => {
    setMobileContinue(bool);
  };

  const setSelectedTimeContext = (time: string) => {
    setSelectedTime(time);
  };

  const setUserActionsDefault = () => {
    setSelectedDay(undefined);
    setSelectedTime('');
    setUserTimezone(moment.tz.guess());
    setOwnersScheduledEvents([]);
    setEventsRetrieved(false);
    setMobileContinue(false);
  };

  return (
    <ProfileContext.Provider
      value={{
        load,
        error,
        mongoid,
        timezone,
        hours,
        days,
        picture,
        events,
        username,
        selectedEvent,
        selectedDay,
        validUser,
        setSelectedEventContext,
        updateSelectedDayContext,
        userTimezone,
        setUserTimezoneContext,
        ownersScheduledEvents,
        setOwnersScheduledEventsContext,
        eventsRetrieved,
        setEventsRetrievedContext,
        mobileContinue,
        setMobileContinueContext,
        selectedTime,
        setSelectedTimeContext,
        setUserActionsDefault,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfile(): IProfileContext {
  return useContext(ProfileContext);
}
