<h1 align="center">📮 Just a Temp</h1>
<p align="center">The free temporary email service powered by Cloudflare
  <br>
  </br>
  <img alt="CodeQL" src="https://github.com/berrysauce/justatemp/actions/workflows/github-code-scanning/codeql/badge.svg">
  <img alt="GitHub release (latest by date including pre-releases)" src="https://img.shields.io/github/v/release/berrysauce/junk.boats?color=blue&include_prereleases&label=latest%20release">
</p>

> ℹ️ This service is 100% powered by [Cloudflare](https://www.cloudflare.com/)

> [!IMPORTANT]
> This project was previously available under the domain "junk.boats".

### What is justatemp.com?
justatemp.com is a yet another, free to use, open source, and of course, privacy-friendly, temporary email generator. You can use justatemp.com to receive emails from sites you don't really want to give your email to. All received emails are publicly stored for 2 hours and then permanently deleted.

<img alt="Just A Temp Screenshot" src="https://public-cdn.berrysauce.me/shared/justatemp-screenshot-yWtqO.png">

### What about privacy?
justatemp.com only stores the received emails. No other user data is stored. The emails are automatically deleted after 2 hours. Until then, everyone with the receiving address can view the emails this address received. For analytics, justatemp.com uses Cloudflare's anonymous web analytics.

### What are collector, postmaster, and postoffice?
- 📮 `mailbox` is a Cloudflare email worker which receives and stores all incoming mails
- 🚚 `postservice` is the email distributor in the form of an API powered by a HonoJS Cloudflare worker
- 🏤 `frontend` is the SvelteKit frontend which displays the received emails to the user

### How does justatemp.com work?
Incoming mails go to the `mailbox` email worker. It saves the email in a Cloudflare KV database. The Svelte frontend generates a random email address and requests all emails for this address from the `postservice`. If emails are available, it displays them, sorted by the UNIX timestamp included in the KV entry.

### Development
More on that soon

## Deploy the frontend to Cloudflare Workers

Use Node.js 22 or newer. From `frontend/`:

```sh
npm ci
npm run build
npx wrangler deploy --dry-run
npm run workers:preview
# After checking the local site, deploy with your Cloudflare credentials:
npm run workers:deploy
```

`workers:preview` builds and runs the frontend locally with Wrangler. SvelteKit's Cloudflare adapter emits the server entry point at `.svelte-kit/cloudflare/_worker.js` and the public assets alongside it; its generated `.assetsignore` prevents server code from being served as an asset. The `ASSETS` binding supplies static files while SvelteKit handles SSR and missing routes. `npm run dev` still runs Vite.

The frontend migration does not move the mailbox or postservice data: those are already separate Workers. Keep their existing bindings and secrets. Before changing the frontend custom domain, validate the new Worker URL, grant the deployment token Workers Scripts Edit and copy any Pages build/runtime settings into the Workers configuration or secrets as appropriate. Disable Pages automatic deployments after validation, and remove the old Pages project only after traffic has moved.

See the [Wrangler v3 to v4 guide](https://developers.cloudflare.com/workers/wrangler/migration/update-v3-to-v4/) and [Pages to Workers guide](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/).
