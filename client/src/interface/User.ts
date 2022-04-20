export interface User {
  username: string;
  email: string;
  serviceid: string;
  strategy: string;
  mongoid: string;
  premium: boolean;
  stripeid: string;
  url: string;
  timezone: string;
  hours: Array<string>;
  days: Array<string>;
  picture: string;
  events: Array<string>;
  schedule: Array<string>;
}

export interface SearchUsersApiData {
  users?: User[];
  error?: { message: string };
}
