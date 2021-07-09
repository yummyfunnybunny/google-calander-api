// ANCHOR Require Modiles
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const dotenv = require("dotenv");
// const axios = require("axios");

// ANCHOR Initialize Config
dotenv.config({
  path: "./config.env",
});

// ANCHOR Set Google Calendar Authentication
const oAuth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
oAuth2Client.setCredentials({ refresh_token: "1//04h0e1idsS_PPCgYIARAAGAQSNwF-L9IrDm1F3UbfPeHIrg9q5y8Vfgylt5mPAb1K9757j3Cm8hNzurcELu44gHo6pg-XmU1DorA" });

// ANCHOR Create Calendar
const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

// ANCHOR List all available appointments
const getAppointments = async (req, res, err) => {
  try {
    const eventsArray = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
    });
    const vacantAppointments = eventsArray.data.items.filter((event) => {
      return event.summary === "vacant appointment";
    });
    console.log(vacantAppointments);
  } catch (err) {
    if (err) return console.log(err);
  }
};

getAppointments();

const allEvents = calendar.events.list({
  calendarId: process.env.GOOGLE_CALENDAR_ID,
});
console.log(allEvents);

// ANCHOR Create Calendar Event
// 1) set start time for event (required)
const eventStartTime = new Date();
eventStartTime.setDate(eventStartTime.getDate() + 1);
// console.log(`eventStartTime: ${eventStartTime}`);

// 2) set end time for event (required)
const eventEndTime = new Date();
eventEndTime.setDate(eventEndTime.getDate() + 1);
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);
// console.log(`eventEndTime: ${eventEndTime}`);

// 3) create the event
const event = {
  summary: "Meet with Dave",
  location: "297 Park Ave, Hopkinton, NH 03229",
  description: "Talking about new client project!",
  start: {
    dateTime: eventStartTime,
    timeZone: "America/New_York",
  },
  end: {
    dateTime: eventEndTime,
    timeZone: "America/New_York",
  },
  colorId: 7,
};

// ANCHOR Perform busy check
calendar.freebusy.query(
  {
    resource: {
      timeMin: eventStartTime,
      timeMax: eventEndTime,
      timeZone: "America/New_York",
      items: [{ id: process.env.GOOGLE_CALENDAR_ID }], // list of calendars
    },
  },
  (err, res) => {
    // const calendarId = res.data.calendars[process.env.GOOGLE_CALENDAR_ID].busy.length;
    // console.log(calendarId);

    if (err) return console.error("Free Busy Query Error:", err);

    if (res.data.calendars[process.env.GOOGLE_CALENDAR_ID].busy.length === 0) {
      return calendar.events.insert(
        {
          calendarId: process.env.GOOGLE_CALENDAR_ID,
          resource: event,
        },
        (err) => {
          if (err) return console.error("Calendar Event Creation Error:", err);

          return console.log("Calendar Event Created!!");
        }
      );
    } else {
      return console.log("Sorry, I'm Busy");
    }
  }
);

// TODO for this tutorial:
/*
figure out how time-zone works
list all other event options we can use!

ANCHOR GITHUB Repo:
https://github.com/CamSkiTheDev/Google-Calendar-NodeJS-App

ANCHOR COLORS:
1 = dark blue
2 = green
3 = purple
4 = maroon
5 = yellow
6 = orange
7 = light blue
8 = gray
9 = blue
10 = light green
11 = red

ANCHOR Time Zones:
Eastern: 'America/New_York'
Central: 'America/Indianapolis'
mountain: 'America/Denver'
pacific: 'America/Los_Angeles
Honolulu: 'Pacific/Honolulu'

*/
