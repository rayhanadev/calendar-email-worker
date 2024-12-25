# CF Calendar Email Worker

This is a Cloudflare Worker that gets triggered when mail is sent to a specific email address. It parses the email
and feeds it into an Llama3.3 70B on Groq to parse the email and extract event details into JSON. The JSON is then
sent to my calendar using the Google Calendar API.
