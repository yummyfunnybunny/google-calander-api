const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const dotenv = require("dotenv");

// ANCHOR -- Initialize Config --
dotenv.config({
  path: "./config.env",
});

const oAuth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

oAuth2Client.setCredentials({ refresh_token: "1//04h0e1idsS_PPCgYIARAAGAQSNwF-L9IrDm1F3UbfPeHIrg9q5y8Vfgylt5mPAb1K9757j3Cm8hNzurcELu44gHo6pg-XmU1DorA" });

const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

const eventStartTime = new Date();
eventStartTime.setDate(eventStartTime.getDate() + 1);
console.log(`eventStartTime: ${eventStartTime}`);
// eventStartTime.setDate(1);

const eventEndTime = new Date();
eventEndTime.setDate(eventEndTime.getDate() + 1);
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);
console.log(`eventEndTime: ${eventEndTime}`);

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

calendar.freebusy.query(
  {
    resource: {
      timeMin: eventStartTime,
      timeMax: eventEndTime,
      timeZone: "America/Denver",
      items: [{ id: "primary" }], // list of calendars
    },
  },
  (err, res) => {
    if (err) return console.error("Free Busy Query Error:", err);

    const eventsArray = res.data.calendars.primary.busy;
    if (eventsArray.length === 0)
      return calendar.events.insert({ calendarId: process.env.GOOGLE_CALENDAR_ID, resource: event }, (err) => {
        if (err) return console.error("Calendar Event Creation Error:", err);

        return console.log("Calendar Event Created!!");
      });

    return console.log("Sorry, I'm Busy");
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
