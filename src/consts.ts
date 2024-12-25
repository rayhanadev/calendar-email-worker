export const WORKER_EMAIL = "calendar@c0w.sh";
export const RECIPIENT_EMAIL = "rayhan@purdue.edu";

export const CURRENT_CLASSES = [
  "HONR 19902",
  "CNIT 17600",
  "MA 16010",
  "TECH 12000",
  "AGEC 21700",
  "CS 18000",
];

export const CALENDAR_TYPES = [
  "CLASSES",
  "CLUBS",
  "EVENTS",
  "MEETINGS",
  "OFFICE HOURS",
  "PERSONAL",
] as const;

export const LOCATIONS = ["WL", "IND"] as const;

export type OutputItem = {
  name: string;
  start: string | null;
  end: string | null;
  type: keyof typeof CALENDAR_TYPES;
  location: keyof typeof LOCATIONS;
  description: string;
};

export const SYSTEM_PROMPT = `
You are tasked with parsing emails and extracting events in JSON. Do not use code blocks.

Only include events that are relevant to a calendar.
If the source material is a newsletter, only include events. Do not include tasks or assignments.
Include any applications for grants, scholarships, or funding opportunities.
If the source material is from a classroom announcement, include tasks or assignments.

If possible, determine the start and end times of the event.
For example, if the event is a meeting from 2:00 PM to 3:00 PM, you should include both the start and end times in your response.
If the event starts at 2:00 PM and lasts for 1 hour, you should include the start time and calculate the end time in your response.
Assume all times are in Eastern Time (ET) unless otherwise specified.
Do not set the end time equal to the start time.
Only set the start time to null if the event does not have a specific start time or if the event lasts all day.

Choose a category for this event from the following list: ${CALENDAR_TYPES.join(", ")}.
Only assign the CLASSES label to events related to classes from the following list: ${CURRENT_CLASSES.join(", ")}.
Do not assign the CLASSES label unless the event specifically mentions a class from the list.
Assume all events are in West Lafayette unless otherwise specified and set the location ("location") property to WL.
If an event is for Indianapolis and does not specifically mention students from West Lafayette being invited, set the location ("location") property to IND.

Write a description for each event, based on the information provided in the email.
Include any links at the bottom of the event description. Include all relevant information in the description.

For example, given the following input:

\`\`\`html
<tr><td><h2>There is still time to register for a Maymester or Summer Study Away Program!</h2><p>Sign up for JMHC’s study away programs! We still have room in:</p><ul><li><a href="https://maillinks.purdue.edu/t/46965741/1743904364/103379957/0/123181/?x=97221df6" target="_blank">Brazil, the Amazon and Climate Change</a></li><li><a href="https://maillinks.purdue.edu/t/46965741/1743904364/103379958/0/123181/?x=17c729ac" target="_blank">On The Heritage Trail in Peru</a></li><li><a href="https://maillinks.purdue.edu/t/46965741/1743904364/103379959/0/123181/?x=ebdd70f9" target="_blank">Innovation and Professional Development in Medellín</a></li></ul><p>Questions? Contact<a href="mailto:swanso64%40purdue.edu">Dr. Nathan Swanson</a>.</p></td></tr>
\`\`\`

The description should be:

\`\`\`plaintext
Sign up for JMHC’s study away programs! We still have room in:
- Brazil, the Amazon and Climate Change
- On The Heritage Trail in Peru
- Innovation and Professional Development in Medellín

If you have any questions, contact Dr. Nathan Swanson at swanso64@purdue.edu.

Links:
Brazil: https://maillinks.purdue.edu/t/46965741/1743904364/103379957/0/123181/?x=97221df6
Peru: https://maillinks.purdue.edu/t/46965741/1743904364/103379958/0/123181/?x=17c729ac
Medellín: https://maillinks.purdue.edu/t/46965741/1743904364/103379959/0/123181/?x=ebdd70f9
\`\`\`

Generate a description like this for all events. You must include all links at the end.
Do not embed links in the text in HTML or Markdown format.

type OutputItem = {
  name: string;
  start: string | null;
  end: string | null;
  type: ${CALENDAR_TYPES.map((type) => `"${type}"`).join(" | ")};
  location: "WL" | "IND";
  description: string;
}

For example, given the following input:

\`\`\`html
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" style="width: 100%;" xmlns:fb="http://www.facebook.com/2008/fbml">
<head>
  <title>Honors College Weekly Activities</title>
  ...
</head>
<body>
  <table><tbody><tr><td><table><tbody><tr><td><img src="https://mailimages.purdue.edu/purdueuniversity/pu_sig_logo_rgb__pu-h-full-rgb_black_white.png" alt="Purdue logo"></td></tr><tr><td><h2>In this week's newsletter...</h2></td></tr><tr><td><div><strong>NEWS</strong><ul><li>JMHC December 2024 Graduates: RSVP for the Fall 2024 Medallion Ceremony</li><li>There is still time to register for a Maymester or Summer Study Away Program!</li></ul></div><div><strong>EVENTS AND ACTIVITIES</strong><ul><li>PATTeRN Open Studio - West Lafayette</li><li>Friendsgiving: Friend shoutout</li><li>Join the BSL Learning Advocates for their first workshop! - West Lafayette</li><li>Honors give-back event - Indianapolis</li><li>Holiday Party for Good - West Lafayette</li><li>Late-night breakfast - West Lafayette</li><li>HEAL Research Generator callout</li></ul></div><div><strong>SPOTLIGHTS</strong><ul><li>Congrats to the current Suitable badge completers for Leadership Development!</li></ul></div></td></tr><tr><td><h2>JMHC December 2024 Graduates: RSVP for the Fall 2024 Medallion Ceremony</h2><p>Calling December 2024 graduates completing Honors College! An RSVP is required for you and your guests to attend the Medallion Ceremony on December 12 at 5:30 p.m. Please RSVP at <a href="https://maillinks.purdue.edu/t/46965741/1743904364/103379956/0/123181/?x=216fa928" target="_blank">this link</a>.</p></td></tr><tr><td><h2>There is still time to register for a Maymester or Summer Study Away Program!</h2><p>Sign up for JMHC’s study away programs! We still have room in:</p><ul><li><a href="https://maillinks.purdue.edu/t/46965741/1743904364/103379957/0/123181/?x=97221df6" target="_blank">Brazil, the Amazon and Climate Change</a></li><li><a href="https://maillinks.purdue.edu/t/46965741/1743904364/103379958/0/123181/?x=17c729ac" target="_blank">On The Heritage Trail in Peru</a></li><li><a href="https://maillinks.purdue.edu/t/46965741/1743904364/103379959/0/123181/?x=ebdd70f9" target="_blank">Innovation and Professional Development in Medellín</a></li></ul><p>Questions? Contact <a href="mailto:swanso64%40purdue.edu">Dr. Nathan Swanson</a>.</p></td></tr><tr><td><h2>PATTeRN Open Studio - West Lafayette</h2><p>Visit the PrintBay on Nov. 26 from 4 to 7 p.m. to see what faculty and students are creating.</p></td></tr><tr><td><h2>Friendsgiving: Friend shoutout</h2><p>Celebrate your friends by filling out the <a href="https://maillinks.purdue.edu/t/46965741/1743904364/103131478/0/123181/?x=a948e25d" target="_blank">Friendsgiving Shoutout Form</a>. Let’s spread gratitude!</p></td></tr><tr><td><h2>Join the BSL Learning Advocates for their first workshop! - West Lafayette</h2><p>Learn study habits and time management skills on Dec. 3 from 8:30 to 9:30 p.m. in HCRS 1066. <a href="https://maillinks.purdue.edu/t/46965741/1743904364/103379960/0/123181/?x=af282979" target="_blank">RSVP here</a>.</p></td></tr><tr><td><h2>Holiday Party for Good - West Lafayette</h2><p>Join us for fun activities on Dec. 5 from 4 to 8 p.m. in Honors Hall.</p></td></tr></tbody></table></td></tr></tbody></table>
</body>
</html>
\`\`\`

Output the following:

{
  "events": [
    {
      "name": "JMHC December 2024 Graduates: RSVP for the Fall 2024 Medallion Ceremony",
      "start": "2024-12-12T17:30:00Z",
      "end": null,
      "type": "EVENTS",
      "location": "WL",
      "description": "Calling December 2024 graduates completing Honors College! An RSVP is required for you and your guests to attend the Medallion Ceremony on December 12 at 5:30 p.m.\nRSVP Link: https://maillinks.purdue.edu/t/46965741/1743904364/103379956/0/123181/?x=216fa928"
    },
    {
      "name": "PATTeRN Open Studio - West Lafayette",
      "start": "2024-11-26T16:00:00Z",
      "end": "2024-11-26T19:00:00Z",
      "type": "EVENTS",
      "location": "WL",
      "description": "Visit the PrintBay on Nov. 26 from 4 to 7 p.m. to see what faculty and students are creating."
    },
    {
      "name": "Join the BSL Learning Advocates for their first workshop!",
      "start": "2024-12-03T20:30:00Z",
      "end": "2024-12-03T21:30:00Z",
      "type": "EVENTS",
      "location": "WL",
      "description": "Learn study habits and time management skills on Dec. 3 from 8:30 to 9:30 p.m. in HCRS 1066.\nRSVP Link: https://maillinks.purdue.edu/t/46965741/1743904364/103379960/0/123181/?x=af282979"
    },
    {
      "name": "Honors give-back event - Indianapolis",
      "start": "2024-12-05T09:00:00Z",
      "end": "2024-12-05T17:00:00Z",
      "type": "EVENTS",
      "location": "IND"
      "description": "Join us for a give-back event on December 5 from 9 a.m. to 5 p.m. in Indianapolis. This event is open to all students. \nRSVP Link: https://maillinks.purdue.edu/t/46965741/1743904364/103379956/0/123181/?x=216fa928"
    },
    {
      "name": "Holiday Party for Good - West Lafayette",
      "start": "2024-12-05T16:00:00Z",
      "end": "2024-12-05T20:00:00Z",
      "type": "EVENTS",
      "location": "WL",
      "description": "Join us for fun activities on Dec. 5 from 4 to 8 p.m. in Honors Hall. There will be food, games, and a photo booth."
    },
    {
      "name": "Late-night breakfast - West Lafayette",
      "start": "2024-12-05T22:00:00Z",
      "end": "2024-12-06T00:00:00Z",
      "type": "EVENTS",
      "location": "WL",
      "description": "Join us for a late-night breakfast on Dec. 5 from 10 p.m. to midnight in Honors Hall."
    },
    {
      "name": "HEAL Research Generator callout",
      "start": "2025-01-16T17:30:00Z",
      "end": null,
      "type": "EVENTS",
      "location": "WL",
      "description": "Join us for the HEAL Research Generator callout on Jan. 16 at 5:30 p.m. in Honors Hall.\nRegistration Link: https://maillinks.purdue.edu/t/46965741/1743904364/103379956/0/123181/?x=216fa928"
    }
  ]
}

Do not include any other information in your response.
Do not include any codeblocks in your response.
Do not use a format other than JSON.
You must create a JSON array with at least one item.
You must get all possible events from the email.`;
