const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const { appointmentEmail, deleteEmail } = require("../utils/sendGrid");
const { deleteEvent, getToken, getCalendar, getAvailability, createEvent } = require("../utils/googleCalendar");

// @route POST /schedule/retrieve
// @desc Return the calendar owners schedule for the day selected by the user
// @access Private
exports.ownerSchedule = asyncHandler(async (req, res) => {
    const { _id, selectedDay } = req.body;
    const existing = await User.find({ _id })

    const { hours, refreshToken, strategy, timezone } = existing[0];

    // In case you want to add compatability with other services like Apple Calendar
    if(strategy === 'google') {
        const accessToken = await getToken(refreshToken);
        const calendar = getCalendar(accessToken);
    
        const startTime = new Date(`${selectedDay} ${hours[0]}`)
        const endTime = new Date(`${selectedDay} ${hours[1]}`)
    
        const userAvailability = await getAvailability(calendar, startTime, endTime, timezone);
        res.status(200).send(userAvailability);
    }
})

// @route POST /schedule/book
// @desc Create a event on owners calendar and send email to user
// @access Private
exports.bookMeeting = asyncHandler(async (req, res) => {
    const { _id, selectedDay, selectedEvent, startTimeGoogle, endTimeGoogle, ownerStartTime, ownerEndTime, name, email, userTimezone } = req.body;
    const existing = await User.find({ _id })

    const { refreshToken, strategy } = existing[0];
    const ownerEmail = existing[0].email;
    const ownerName = existing[0].username;
    const ownerTimezone = existing[0].timezone;

    // In case you want to add compatability with other services like Apple Calendar
    if(strategy === 'google') {
        const accessToken = await getToken(refreshToken);
        const calendar = getCalendar(accessToken);
        
        const color = selectedEvent[1]

        let colorid;

        if(color === '#019afb') colorid = 1
        if(color === '#89b802') colorid = 2
        if(color === '#7900ff') colorid = 3
        if(color === '#ff4f26') colorid = 4
        if(color === '#ff7000') colorid = 6
        if(color === '#40e0d0') colorid = 7

        const startTime = new Date(`${selectedDay} ${ownerStartTime}`)
        const endTime = new Date(`${selectedDay} ${ownerEndTime}`)

        const event = {
            summary: selectedEvent[2],
            description: `Meeting with ${name} (${email})`,
            start : {
                dateTime: startTime,
                timeZone: ownerTimezone
            },
            end : {
                dateTime: endTime,
                timeZone: ownerTimezone
            },
            colorId: colorid,
        }

        const googleEvent = await createEvent(calendar, event);

        if (googleEvent) {
            const newScheduledEvent = `${selectedDay}/${selectedEvent[0]}/${color}/${selectedEvent[2]}/${name}/${email}/${ownerStartTime}-${ownerEndTime}/${startTimeGoogle}-${endTimeGoogle}/${userTimezone}/${googleEvent.data.id}`;
        
            let schedule = existing[0].schedule;
            schedule.push(newScheduledEvent);
        
            await User.findOneAndUpdate({ _id }, { schedule })
            appointmentEmail({
                selectedDay,
                name,
                email,
                ownerStartTime,
                ownerEndTime,
                appointment: googleEvent.data.id,
                ownerName,
                ownerEmail,
                startTime: startTimeGoogle,
                endTime: endTimeGoogle,
                ownerTimezone,
                userTimezone,
                _id,

            })
            res.status(200).send({ googleEventId: googleEvent.data.id });
        } else {
            res.status(400).send({ message: 'Appointment could not be added to the owners calendar' })
        }
    }
})


// @route POST /schedule/delete
// @desc Delete an event from owners calendar and send email to both user and owner to confirm
// @access Private
module.exports.deleteMeeting = asyncHandler(async (req, res) => {
    const { _id, eventId } = req.body;
    const existing = await User.find({ _id })

    const ownerEmail = existing[0].email;
    let { schedule } = existing[0];
    const { username, refreshToken, strategy, timezone } = existing[0];

    let scheduleIndex;

    schedule.forEach((appointment, index) => {
        let splitAppoint = appointment.split('/');
        if (splitAppoint[10] === eventId) scheduleIndex = index
    })

    const readableAppointment = schedule[scheduleIndex].split('/');
    const ownerTime = readableAppointment[6].split('-');
    const userTime = readableAppointment[7].split('-');

    // In case you want to add compatability with other services like Apple Calendar
    if(strategy === 'google') {
        const accessToken = await getToken(refreshToken);
        const calendar = getCalendar(accessToken);

        const params = {
            calendarId: 'primary',
            eventId: eventId,
      };

      const deleteGoogleEvent = await deleteEvent(calendar, params);

      if (!deleteGoogleEvent) {
          deleteEmail({
            selectedDay: readableAppointment[0],
            name: readableAppointment[4],
            email: readableAppointment[5],
            ownerStartTime: ownerTime[0],
            ownerEndTime: ownerTime[1],
            ownerTimezone: timezone,
            ownerName: username,
            ownerEmail,
            startTime: userTime[0],
            endTime: userTime[1],
            userTimezone: `${readableAppointment[8]}/${readableAppointment[9]}`,
            _id,
          })
          schedule = schedule.filter(appoint => appoint !== schedule[scheduleIndex]);
          await User.findOneAndUpdate({ _id }, { schedule });
          res.status(200).send({ message: 'Appointment has been successfully deleted' })
        }
      else res.status(400).send({ message: 'Appointment could not be deleted at this time. Try again later.' })
    }
})

// @route POST /schedule/meeting
// @desc Retrieve meeting information using mongo and google event id
// @access Private
module.exports.meetingInfo = asyncHandler(async (req, res) => {
    const { _id, eventId } = req.body;
    const existing = await User.find({ _id })

    if (existing) {
        const { schedule, username, url } = existing[0];
        let scheduleIndex;

        schedule.forEach((appointment, index) => {
            let splitAppoint = appointment.split('/');
            if (splitAppoint[10] === eventId) scheduleIndex = index
        })

        if (scheduleIndex !== undefined) res.status(200).send({ meetingInfo: schedule[scheduleIndex], username, url })
        else res.status(400).send({ message: 'Meeting does not exist' })
    } else {
        res.status(400).send({ message: 'User does not exist' })
    }
})