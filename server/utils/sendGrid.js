const sgMail = require('@sendgrid/mail');
const asyncHandler = require("express-async-handler");

sgMail.setApiKey(process.env.SENDGRID_API);

module.exports.appointmentEmail = asyncHandler(async (info) => {
    const ownerMessage = {
        to: info.ownerEmail,
        from: process.env.SENDGRID_EMAIL,
        subject: `${info.selectedDay}: Appointment Created`,
        text: 
            `Appointment has been scheduled with ${info.name} (${info.email}). 
            On ${info.selectedDay} from ${info.ownerStartTime} to ${info.ownerEndTime} (${info.ownerTimezone}). 
            If you wish to cancel or reschedule use the following link:
            ${process.env.CLIENT}/change/${info._id}/${info.appointment}`,
    }

    const userMessage = {
        to: info.email,
        from: process.env.SENDGRID_EMAIL,
        subject: `${info.selectedDay}: Appointment Created`,
        text:
          `Appointment has been scheduled with ${info.ownerName} (${info.ownerEmail})
          On ${info.selectedDay} from ${info.startTime} to ${info.endTime} (${info.userTimezone}). 
          If you wish to cancel or reschedule use the following link:
          ${process.env.CLIENT}/change/${info._id}/${info.appointment}`,
      };

      sgMail.send(ownerMessage);
      sgMail.send(userMessage);
})

module.exports.deleteEmail = asyncHandler(async (info) => {
    const ownerMessage = {
        to: info.ownerEmail,
        from: process.env.SENDGRID_EMAIL,
        subject: `${info.selectedDay}: Appointment Cancelled`,
        text: 
            `Appointment has been cancelled with ${info.name} (${info.email}). 
            On ${info.selectedDay} from ${info.ownerStartTime} to ${info.ownerEndTime} (${info.ownerTimezone}).`,
    }

    const userMessage = {
        to: info.email,
        from: process.env.SENDGRID_EMAIL,
        subject: `${info.selectedDay}: Appointment Cancelled`,
        text:
          `Appointment has been cancelled with ${info.ownerName} (${info.ownerEmail})
          On ${info.selectedDay} from ${info.startTime} to ${info.endTime} (${info.userTimezone}).`,
      };

      sgMail.send(ownerMessage);
      sgMail.send(userMessage);
})