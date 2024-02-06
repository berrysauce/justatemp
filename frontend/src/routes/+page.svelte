<script>
// @ts-nocheck

    import { onMount } from "svelte";
    import { generate } from "random-words";

    // get receiving email from store
    import { receivingEmail } from "../lib/stores";
    let address = $receivingEmail;

    const url = "https://post.justatemp.com"
  
    let copyrightYear = new Date().getFullYear();
    let emails = []
    let stats = {}

    // automatically stop auto-refresh after 20 refreshes
    let stopReloadOn = 20
    let reloadCounter = 0
    let reloadActive = true
  
    onMount(async function () {
        const response = await fetch(`${url}/mail/get?address=${address}`);
        const data = await response.json();
        emails = data.mails;
        stats = data.stats;
        
        if (address === null) {
            generateEmail(false)
        }
    });
    
    // @ts-ignore
    async function generateEmail(reload) {
        let words = generate(2)
        receivingEmail.set(words[0] + "." + words[1] + Math.floor(Math.random() * 1000) + "@justatemp.com")

        if (reload) {
            // use this instead of window.location.reload(); to avoid resending POST requests
            // @ts-ignore
            window.location = window.location.href;
        }
    }
  
    async function manualReload() {
        const response = await fetch(`${url}/mail/get?address=${address}`);
        const data = await response.json();
        emails = data.mails;
        stats = data.stats;
    }
  
    async function timedReload() {
        if (reloadCounter >= stopReloadOn) {
            reloadActive = false
            clearInterval(intervalID);
        }
        const response = await fetch(`${url}/mail/get?address=${address}`);
        const data = await response.json();
        emails = data.mails;
        stats = data.stats;
        reloadCounter += 1
    }

    async function deleteEmail(email) {
        if (confirm("Do you really want to permanently delete this email?")) {
            let emailKey = email.recipient + "-" + email.suffix
            const response = await fetch(`${url}/mail/delete?key=${emailKey}`);
            const data = await response.json();
            
            if (data.code === 200) {
                // use this instead of window.location.reload(); to avoid resending POST requests
                // @ts-ignore
                window.location = window.location.href;
            } else {
                console.log(`ERROR - Failed to delete email with request status ${data.code}`)
            }
        }
    }

    async function forwardEmail(email) {
        let emailKey = email.recipient + "-" + email.suffix
        let forwardTo = prompt("Please enter the email address you want to forward this email to:", "");

        if (forwardTo === null || forwardTo === "") {
            console.log("Error - No email address entered");
            return;
        }

        const response = await fetch(`${url}/mail/forward`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ key: emailKey, forward: forwardTo }),
        });
    }
  
    // automatic refresh every 20 seconds (in milliseconds)
    // intervalID is used with clearInterval to stop the given interval
    const intervalID = setInterval(timedReload, 20000); 
</script>

<!-- Away Banner -->
{#if !reloadActive}
    <div style="background: var(--bs-red);padding: 16px;">
        <p class="text-center" style="margin-bottom: 0px;color: rgba(255,255,255,0.8);font-weight: 500;">
            <span style="font-weight: 600;color: rgb(255,255,255);">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="font-size: 20px;margin-top: -4px;margin-right: 8px;">
                    <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                Are you still there?
            </span> 
            Please reload the page to re-enable automatic refresh. I need to do this too save my yummy bandwidth.
        </p>
    </div>
{/if}

<section class="py-4 py-xl-5">
    <div class="container" style="max-width: 800px;">
        <div class="text-center p-4 p-lg-5">
            <!-- Header -->
            <h1 class="text-start" style="font-family: 'Inter Tight', sans-serif;font-weight: 600;margin-bottom: 16px;">
                <span style="font-weight: normal !important; color: rgb(255, 255, 255);">📮&nbsp;</span>
                Just a Temp
            </h1>
            <p class="text-start" style="margin-bottom: 32px;font-size: 20px;">
                Yet another temporary email generator. But this time open source, ad-free, and privacy-friendly. Generate a temporary email below and receive emails.
            </p>
            <!-- This site uses Cloudflare's Server-side Excludes (SSE) -->
            <!-- By using SSE, we can hide information from suspicious visitors -->
            <div class="d-xl-flex justify-content-xl-center align-items-xl-center" style="margin-top: 32px;margin-bottom: 16px;">
                <div style="padding: 8px 30px;border-width: 2px;border-style: solid;border-radius: 16px;width: 100%;margin-right: 16px;height: 50px;margin-bottom: 16px;">
                    <p class="text-truncate text-start" style="margin-bottom: 0px;font-size: 20px;"><!--sse-->{address}<!--/sse--></p>
                </div>
                <button class="btn btn-primary" type="button" on:click={generateEmail} style="padding: 8px 30px;border-radius: 16px;border-width: 2px;border-color: rgb(33,37,41);background: rgb(33,37,41);font-weight: 500;height: 50px;font-size: 20px;min-width: 220px;margin-bottom: 16px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="font-size: 24px;margin-top: -4px;margin-right: 6px;">
                        <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    Re-generate
                </button>
            </div>
            
            {#if reloadActive}
                <!-- Loading Indicator -->
                <div style="padding: 32px;margin-bottom: 32px;">
                    <img src="/assets/img/ring-resize.svg?h=2f4014e589baa9dfda8b268abeba3c2b" alt="Loading" style="width: 32px;height: 32px;margin-top: -8px;margin-right: 16px;">
                    <span style="font-weight: 500;font-size: 20px;">Waiting for incoming emails</span>
                </div>
            {:else}
                <!-- Automatic refresh stopped -->
                <div style="padding: 32px;margin-bottom: 32px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="font-size: 32px;margin-top: -6px;margin-right: 16px;color: var(--bs-red);">
                        <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <span style="font-weight: 500;font-size: 20px;">Automatic refresh stopped</span>
                </div>
            {/if}

            <!-- Error -->
            <!--
            <div style="padding: 32px;border-radius: 16px;margin-bottom: 32px;border: 2px dashed rgb(215,215,215);">
                <p style="font-size: 20px;margin-top: 16px;font-weight: 500;color: var(--bs-red);margin-bottom: 0px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="font-size: 44px;margin-bottom: 16px;color: var(--bs-red);">
                        <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <br />
                    Oh no! Errors incoming...
                </p>
                <p style="max-width: 500px;margin-left: auto;margin-right: auto;">API Server Error (500)</p>
            </div>
            -->

            {#if emails.length === 0}
                <!-- Incoming Emails -->
                <div style="padding: 32px;border-radius: 16px;margin-bottom: 32px;border: 2px dashed rgb(215,215,215) ;">
                    <p style="font-size: 20px;margin-top: 16px;font-weight: 500;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="font-size: 44px;margin-bottom: 16px;color: rgb(215,215,215);">
                            <path d="M3 21V17M3 17V5C3 3.89543 3.89543 3 5 3H11.5L12.5 4H21L18 10L21 16H12.5L11.5 15H5C3.89543 15 3 15.8954 3 17ZM12 3.5V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <br>
                        Incoming mails will show up here
                    </p>
                </div>
            {:else}
                <!--sse-->
                {#each emails as email}
                    <!-- Email Template -->
                    <div style="padding: 32px;border: 2px solid rgb(215,215,215);border-radius: 16px;margin-bottom: 32px;">
                        <div class="d-xl-flex justify-content-xl-start align-items-xl-center" style="margin-bottom: 22px;height: 56px;">
                            <div class="text-start flex-grow-1" style="padding-bottom: 16px;border-bottom: 2px solid rgb(215,215,215);position: relative;display: inline;overflow: hidden;">
                                <p style="font-size: 20px;margin-bottom: 0px;width: 100%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;position: relative;padding-right: 100px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="1em" viewBox="0 0 24 24" width="1em" fill="currentColor" style="margin-top: -4px;margin-right: 8px;color: rgb(255,221,51);">
                                        <g>
                                            <rect fill="none" height="24" width="24"></rect>
                                        </g>
                                        <g>
                                            <g>
                                                <path d="M12,2C6.47,2,2,6.47,2,12s4.47,10,10,10s10-4.47,10-10S17.53,2,12,2z"></path>
                                            </g>
                                        </g>
                                    </svg>
                                    {email.sender}
                                    
                                    <span style="top: 0;right: 0;position: absolute;width: 100px;">
                                        <!-- Forward -->
                                        <button class="btn btn-primary" type="button" on:click={forwardEmail(email)} style="padding: 4px;border-style: none;background: rgba(255,255,255,0);">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="font-size: 24px;margin-top: -4px;color: rgb(33,37,41);">
                                                <path d="M3 10H13C17.4183 10 21 13.5817 21 18V20M3 10L9 16M3 10L9 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                        </button>
                                        
                                        <!-- Info -->
                                        <button class="btn btn-primary" type="button" style="padding: 4px;border-style: none;background: rgba(255,255,255,0);">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="font-size: 24px;margin-top: -4px;color: rgb(33,37,41);">
                                                <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                        </button>
                                        
                                        <!-- Delete -->
                                        <button class="btn btn-primary" type="button" on:click={deleteEmail(email)} style="padding: 4px;border-style: none;background: rgba(255,255,255,0);">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="font-size: 24px;margin-top: -4px;color: var(--bs-red);">
                                                <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                        </button>
                                    </span>
                                </p>
                                <p style="font-size: 20px;font-weight: 600;margin-bottom: 0px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                    {email.subject}
                                </p>
                            </div>
                        </div>
                        <p class="text-start" style="margin-bottom: 0px;margin-top: 32px;">
                            <!-- {@html email["content-html"]} -->
                            {@html email["content-plain-formatted"]}
                            
                            <!--
                            Set the password for your profile<br><br>You or someone else has requested a Miro profile for this email address. To create &nbsp;your profile, click on the button to set your password.<br><br><span style="border: 2px solid rgb(13,110,253);border-radius: 10px;padding: 1px 8px;"><a href="#" style="text-decoration: none;">Set Password<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="margin-bottom: 4px;margin-left: 4px;">
                                        <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg></a></span><br><br>If you didn't make this request, you can safely ignore this email. If you have any questions, you can&nbsp;contact us through our form.<br><br>This email was sent to&nbsp;max@justatemp.com.<br><br>Miro, 201 Spear St., Suite 1100<br>San Francisco, CA&nbsp;94105, United States<br><br><span style="border: 2px solid rgb(13,110,253);border-radius: 10px;padding: 1px 8px;"><a href="#" style="text-decoration: none;">Help Center<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="margin-bottom: 4px;margin-left: 4px;">
                                        <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg></a></span>&nbsp; |&nbsp;&nbsp;<span style="border: 2px solid rgb(13,110,253);border-radius: 10px;padding: 1px 8px;"><a href="#" style="text-decoration: none;">Privacy Policy<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" style="margin-bottom: 4px;margin-left: 4px;">
                                        <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg></a></span>
                            -->
                        </p>
                    </div>
                {/each}
                <!--/sse-->
            {/if}
        </div>

        <!-- Footer -->
        <div class="text-center p-4 p-lg-5">
            <p class="text-start" style="margin-bottom: 32px;font-size: 16px;">
                We've received&nbsp;
                
                <!-- Received Emails -->
                <!--sse-->
                <span class="font-monospace" style="color: rgb(255,255,255);background: rgb(33,37,41);border-radius: 10px;padding: 4px 12px;font-size: 14px;margin-right: 2px;margin-left: 2px;">
                    {stats.count}
                </span>
                <!--/sse-->
                
                &nbsp;emails so far.
            </p>
            <p class="text-start" style="margin-bottom: 4px;font-size: 16px;">
                Made with lots of 🥨 in Germany
                
                <span class="float-end">
                    <a href="https://berrysauce.me/privacy" target="_blank" style="color: inherit;">Privacy</a>&nbsp;&nbsp;
                    <a href="https://berrysauce.me/terms" target="_blank" style="color: inherit;">Terms</a>&nbsp;&nbsp;
                    <a href="https://github.com/berrysauce/justatemp/blob/main/LICENSE" target="_blank" style="color: inherit;">License</a>&nbsp;&nbsp;
                    <!--sse-->
                    <a href="mailto:hey@justatemp.com" style="color: inherit;">Contact</a>
                    <!--/sse-->
                </span>
            </p>
            <p class="text-start" style="margin-bottom: 4px;font-size: 16px;">
                Copyright © {copyrightYear} berrysauce
            </p>
        </div>
    </div>
</section>