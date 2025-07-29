
<div align="right">
  <details>
    <summary >🌐 Language</summary>
    <div>
      <div align="center">
        <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=en">English</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=zh-CN">简体中文</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=zh-TW">繁體中文</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=ja">日本語</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=ko">한국어</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=hi">हिन्दी</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=th">ไทย</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=fr">Français</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=de">Deutsch</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=es">Español</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=it">Italiano</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=ru">Русский</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=pt">Português</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=nl">Nederlands</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=pl">Polski</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=ar">العربية</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=fa">فارسی</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=tr">Türkçe</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=vi">Tiếng Việt</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=id">Bahasa Indonesia</a>
        | <a href="https://openaitx.github.io/view.html?user=berrysauce&project=justatemp&lang=as">অসমীয়া</
      </div>
    </div>
  </details>
</div>

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
