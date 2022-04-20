const { google } = require("googleapis");

const { OAuth2 } = google.auth;
const asyncHandler = require("express-async-handler");

module.exports.getToken = asyncHandler(async (refreshToken) => {
    const oAuth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
    const token = await oAuth2Client.getRequestHeaders();
    return token.Authorization.replace("Bearer ", "");
});

module.exports.getCalendar = ((accessToken) => {
    const oAuth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    oAuth2Client.setCredentials({ access_token: accessToken });
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client })
    return calendar;
});
  
module.exports.getAvailability = asyncHandler(async (calendar, timeMin, timeMax, timeZone) => {
    const events = await calendar.freebusy.query(
        {
            resource: {
                timeMin,
                timeMax,
                timeZone,
                items: [{ id: 'primary' }],
            }
        },
        )
        if (events.status === 200 ) return events.data.calendars.primary.busy
        else throw new Error("Query Error.")
})

module.exports.createEvent = asyncHandler(async (calendar, event) => {
    const res = await calendar.freebusy.query({
      resource: {
        timeMin: event.start.dateTime,
        timeMax: event.end.dateTime,
        timeZone: event.start.timeZone,
        items: [{ id: "primary" }],
      },
    });
  
    if (res.status !== 200) return ('Unable to get availability')
  
    const eventsArr = res.data.calendars.primary.busy
    if (eventsArr.length === 0) return calendar.events.insert({ calendarId: "primary", resource: event })
    else return ("This time slot is occupied")
});

module.exports.deleteEvent = async (calendar, params) => {
    calendar.events.delete(params, function (err) {
      if (err) return false;
      else return true;
    });
  };