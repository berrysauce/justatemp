<h1 align="center">♻️ junk.boats</h1>
<p align="center">The free temporary email service powered by Cloudflare
  <br>
  </br>
  <img alt="CodeQL" src="https://github.com/berrysauce/junk.boats/actions/workflows/github-code-scanning/codeql/badge.svg">
  <img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/berrysauce/junk.boats?color=blue&include_prereleases&label=latest%20release">
</p>

> ℹ️ This service is 100% powered by [Cloudflare](https://www.cloudflare.com/)

### What is junk.boats?
junk.boats is a yet another, free to use, open source, and of course, privacy-friendly, temporary email generator. You can use junk.boats to receive emails from sites you don't really want to give your email to. All received emails are publicly stored for 2 hours and then permanently deleted.

<img alt="junkboats-screenshot" src="https://bcdn.berrysauce.me/shared/screely-1676654369981.png">

### What about privacy?
junk.boats only stores the received emails. No other user data is stored. The emails are automatically deleted after 2 hours. Until then, everyone with the receiving address can view the emails this address received. For analytics, junk.boats uses Cloudflare's anonymous web analytics.

### What are collector, postmaster, and postoffice?
- 📮 `collector` is a Cloudflare email worker which receives and stores all incoming mails
- 🚚 `postmaster` is the email distributor in the form of an API powered by a HonoJS Cloudflare worker
- 🏤 `postoffice` is the Vite + Svelte frontend which displays the received emails to the user

### How does junk.boats work?
Incoming mails go to the `collector` email worker. It saves the email in a Cloudflare KV database. The Svelte frontend generates a random email address and requests all emails for this address from the `postmaster`. If emails are available, it displays them, sorted by the UNIX timestamp included in the KV entry.

<p align="center">
  <br>
  <img alt="junkboats Diagram" src="https://bcdn.berrysauce.me/shared/Unbenanntes%20Diagramm.drawio(3).png">
  <br>
</p>

### Why the domain "junk.boats"?
I wanted a domain with "junk" in it, and the .boats TLD was available, so I decided to use that. I might add additional similar domains later.

### Development
More on that soon
