# junk.boats
♻️ The free temporary email service powered by Cloudflare

### What is junk.boats?
junk.boats is a yet another, free to use, open source, and of course, privacy-friendly, temporary email generator. You can use junk.boats to receive emails from sites you don't really want to give your email to. All received emails are publicly stored for 2 hours and then permanently deleted.

### What are postmaster and postoffice?
`postmaster` is the email receiver and distributor in the form of an API. `postoffice` is the Vite + Svelte frontend which displays the received emails to the user.

### How does junk.boats work?
⚠️ For now, junk.boats uses Mailgun to send & receive emails. This not only results in delays, but also means that **all incoming mails are stored for up to 3 days on Mailgun's servers**. When Cloudflare's email workers get a bit better and more reliable I'll switch to using them.

Incoming mails go to Mailgun and get stored there. Their service also sends a HTTP POST request to `postman.junk.boats`. "Postman" is the API/backend behind this service. It receives the request and stores the email in a Cloudflare KV database. The frontend generates a random email address and requests all emails for this address. If emails are available, it displays them, sorted by the UNIX timestamp included in the KV entry.

### Why the domain "junk.boats"?
I wanted a domain with "junk" in it, and the .boats TLD was free, so I decided to use that.