<script>
  import { onMount } from "svelte";
  import Email from './lib/Email.svelte';
  import Waiting from './lib/Waiting.svelte';
  import Reload from './lib/Reload.svelte';
  import randomWords from "random-words";

  let receivingEmail = localStorage.getItem("receivingEmail")
  let copyrightYear = new Date().getFullYear();
  let emails = []
  let stats = {}
  // automatically stop auto-refresh after 30 refreshes
  let stopReloadOn = 30
  let reloadCounter = 0
  let reloadActive = true

  onMount(async function () {
    const response = await fetch(`https://postmaster.junk.boats/get/mail?address=${receivingEmail}`);
    const data = await response.json();
    emails = data.mails;
    stats = data.stats;
    
    if (localStorage.getItem("receivingEmail") === null) {
      generateEmail(false)
    }
  });

  async function generateEmail(reload) {
    let words = randomWords(2)
    receivingEmail = words[0] + "." + words[1] + Math.floor(Math.random() * 1000) + "@junk.boats"
    localStorage.setItem("receivingEmail", receivingEmail)

    if (reload) {
      // use this instead of window.location.reload(); to avoid resending POST requests
      // @ts-ignore
      window.location = window.location.href;
    }
  }

  async function manualReload() {
    const response = await fetch(`https://postmaster.junk.boats/get/mail?address=${receivingEmail}`);
    const data = await response.json();
    emails = data.mails;
    stats = data.stats;
  }

  async function timedReload() {
    if (reloadCounter >= stopReloadOn) {
      reloadActive = false
      clearInterval(intervalID);
    }
    const response = await fetch(`https://postmaster.junk.boats/get/mail?address=${receivingEmail}`);
    const data = await response.json();
    emails = data.mails;
    stats = data.stats;
    reloadCounter += 1
  }

  // automatic refresh every 10 seconds (in milliseconds)
  // intervalID is used with clearInterval to stop the given interval
  const intervalID = setInterval(timedReload, 15000); 
</script>

<main>
  <section class="py-4 py-xl-5">
    <div class="container">
      <div class="row">
        <div class="col-md-12 col-lg-5 col-xl-5 col-xxl-4">
          <div style="padding: 32px; background: #f4f4f4; border: 1px solid rgb(206, 207, 208); border-radius: 10px; margin-bottom: 20px;">
            <h1 class="fw-light" style="margin-bottom: 16px; font-size: 72px;">
              ♻️
            </h1>
            <h1 class="fw-semibold" style="font-family: 'Inter Tight', sans-serif; color: rgb(33, 37, 41); margin-bottom: 0px;"><span style="color: rgb(90, 179, 75);">junk</span>.boats</h1>
            <p style="margin-bottom: 32px;">
              <span style="color: rgb(153, 153, 153);">Yet another temporary email generator. </span><br />
              <br />
              But this time open source, ad-free, and privacy-friendly. Generate a temporary email below and receive emails.
            </p>
            <div />
            <div style="padding: 10px 30px; border: 1px solid rgb(206, 207, 208); border-radius: 10px; margin-top: 32px;">
              <p class="text-center" style="margin-bottom: 2px; font-weight: bold; font-size: 12px; color: rgb(153, 153, 153); letter-spacing: 1px;">
                RECEIVING EMAILS ON
              </p>
              <!-- SSE is used by Cloudflare to hide data from potential bots -->
              <!--sse-->
              <p class="font-monospace text-center text-break" style="margin-bottom: 0px;">
                {receivingEmail}
              </p>
              <!--/sse-->
            </div>
            <div style="padding: 10px 30px; border: 1px solid rgb(206, 207, 208); border-radius: 10px; margin-top: 16px;">
              <p class="text-center" style="margin-bottom: 2px; font-weight: bold; font-size: 12px; color: rgb(153, 153, 153); letter-spacing: 1px;">
                CHANGE DOMAIN<span class="fw-semibold" style="margin-left: 5px; padding: 1px 4px; background: #5ab34b; border-radius: 5px; border-style: none; color: rgb(255, 255, 255); letter-spacing: 0px;">SOON</span>
              </p>
              <select style="width: 100%; background: rgba(255, 255, 255, 0); border-style: none; text-align: center;" disabled>
                <option value="junk.boats">junk.boats</option>
              </select>
            </div>
            <div style="padding: 10px 30px; border: 1px solid rgb(206, 207, 208); border-radius: 10px; margin-bottom: 16px; margin-top: 16px;">
              <p class="text-center" style="margin-bottom: 2px; font-weight: bold; font-size: 12px; color: rgb(153, 153, 153); letter-spacing: 1px;">
                STATUS
              </p>
              <p class="text-center" style="margin-bottom: 0px;"><span class="spinner-border" role="status" style="width: 16px; height: 16px; margin-right: 8px; border-width: 2px; color: rgb(90, 179, 75);" />Waiting for new emails</p>
            </div>
            <!-- This function is needed (on:click={() => handleClick("arg1", "arg2")}) as on:click={function} would instantly excecute the function -->
            <!-- https://stackoverflow.com/a/61025286/10415189 -->
            <button class="btn btn-primary" type="button" on:click={() => generateEmail(true)} style="width: 100%; border-radius: 10px; background: rgb(90, 179, 75); padding: 10px 30px; margin-bottom: 6px; border: 1px solid rgb(90, 179, 75);">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="font-size: 18px; margin-bottom: 3px; margin-right: 5px;">
                <path
                  d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Re-generate burner email
            </button>
            <button class="btn btn-primary" id="refreshButton" type="button" on:click={() => manualReload()} style="width: 100%; border-radius: 10px; background: rgba(33, 37, 41, 0); padding: 10px 30px; color: rgb(90, 179, 75); border: 1px none rgb(33, 37, 41);">
              <svg class="rotate" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="font-size: 18px; margin-bottom: 3px; margin-right: 5px;">
                <path
                  d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Manually reload emails
            </button>
            <script>
              // make the SVG in the manual refresh button spinnable
              const refreshButton = document.getElementById("refreshButton");
              const refreshIcon = refreshButton.querySelector("svg");

              refreshButton.addEventListener("click", function() {
                refreshIcon.classList.add("rotate");
                
                // remove the class after the animation finishes
                setTimeout(function() {
                  refreshIcon.classList.remove("rotate");
                }, 1000); // set the timeout to the same duration as the animation
              });
            </script>
            <p style="margin-top: 100px; color: rgb(164, 164, 164); font-size: 14px;"><span class="font-monospace" style="color: rgb(90, 179, 75);">{stats.count}</span>&nbsp;emails received since 02/2023</p>
            <ul class="list-inline text-start" style="margin-bottom: 0px; margin-top: 0px; font-size: 12px; color: rgb(164, 164, 164);">
              <li class="list-inline-item">
                <a href="#" style="color: inherit;">Terms of Service</a>
              </li>
              <li class="list-inline-item">
                <a href="#" style="color: inherit;">Privacy Policy</a>
              </li>
              <li class="list-inline-item">
                <a href="#" style="color: inherit;">Cookies</a>
              </li>
              <li class="list-inline-item">
                <a href="#" style="color: inherit;">Contribute on GitHub</a>
              </li>
              <li class="list-inline-item">
                <a href="#" style="color: inherit;">Donate</a>
              </li>
            </ul>
            <p class="text-start" style="margin-bottom: 0px; color: rgb(164, 164, 164); font-size: 12px; margin-top: 10px;">
              Copyright {copyrightYear} © berrysauce · Powered by
              <span style="color: rgb(246, 102, 51);">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -64 640 640" width="1em" height="1em" fill="currentColor" style="font-size: 16px; margin-right: 3px; margin-left: 2px;">
                  <!--! Font Awesome Free 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. -->
                  <path
                    d="M407.906,319.913l-230.8-2.928a4.58,4.58,0,0,1-3.632-1.926,4.648,4.648,0,0,1-.494-4.147,6.143,6.143,0,0,1,5.361-4.076L411.281,303.9c27.631-1.26,57.546-23.574,68.022-50.784l13.286-34.542a7.944,7.944,0,0,0,.524-2.936,7.735,7.735,0,0,0-.164-1.631A151.91,151.91,0,0,0,201.257,198.4,68.12,68.12,0,0,0,94.2,269.59C41.924,271.106,0,313.728,0,366.12a96.054,96.054,0,0,0,1.029,13.958,4.508,4.508,0,0,0,4.445,3.871l426.1.051c.043,0,.08-.019.122-.02a5.606,5.606,0,0,0,5.271-4l3.273-11.265c3.9-13.4,2.448-25.8-4.1-34.9C430.124,325.423,420.09,320.487,407.906,319.913ZM513.856,221.1c-2.141,0-4.271.062-6.391.164a3.771,3.771,0,0,0-3.324,2.653l-9.077,31.193c-3.9,13.4-2.449,25.786,4.1,34.89,6.02,8.4,16.054,13.323,28.238,13.9l49.2,2.939a4.491,4.491,0,0,1,3.51,1.894,4.64,4.64,0,0,1,.514,4.169,6.153,6.153,0,0,1-5.351,4.075l-51.125,2.939c-27.754,1.27-57.669,23.574-68.145,50.784l-3.695,9.606a2.716,2.716,0,0,0,2.427,3.68c.046,0,.088.017.136.017h175.91a4.69,4.69,0,0,0,4.539-3.37,124.807,124.807,0,0,0,4.682-34C640,277.3,583.524,221.1,513.856,221.1Z"
                  />
                </svg>
                Cloudflare
              </span>
            </p>
          </div>
        </div>
        <div class="col-md-12 col-lg-7 col-xxl-8" style="padding-right: 12px; padding-left: 12px;">

          {#if reloadActive === false}
            <Reload/>
          {/if}

          {#if emails.length === 0 && reloadActive === true}
            <Waiting receivingEmail={receivingEmail}/>
          {:else}
            {#each emails as email (email.suffix)}
              <Email email={email}/>
            {/each}
          {/if}

        </div>
      </div>
    </div>
  </section>
</main>

<style>
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .rotate {
    animation: spin 1s linear;
  }
</style>
