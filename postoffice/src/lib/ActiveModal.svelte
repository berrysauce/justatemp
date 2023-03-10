<script>
    async function reloadWindow() {
        // use this instead of window.location.reload(); to avoid resending POST requests
        // @ts-ignore
        window.location = window.location.href;
    }
</script>

<main>
  <div id="stillActiveModal" class="modal fade show" role="dialog" tabindex="-1" style="display: block;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-body text-center">
                <div style="padding: 20px;padding-right: 40px;padding-left: 40px;">
                    <h4 class="text-center" style="font-family: Inter, sans-serif;letter-spacing: -0.5px;"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20" fill="none" style="color: rgb(90,179,75);font-size: 50px;margin-bottom: 25px;">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM11 14C11 14.5523 10.5523 15 10 15C9.44772 15 9 14.5523 9 14C9 13.4477 9.44772 13 10 13C10.5523 13 11 13.4477 11 14ZM10 5C9.44772 5 9 5.44772 9 6V10C9 10.5523 9.44772 11 10 11C10.5523 11 11 10.5523 11 10V6C11 5.44772 10.5523 5 10 5Z" fill="currentColor"></path>
                        </svg><br />Are you still here?</h4>
                    <p class="text-center" style="margin-bottom: 40px;">Please reload the page or click the button below to <span style="color: rgb(90, 179, 75);">re-enable the automatic refresh</span> of incoming emails. We need to do this to save bandwidth.</p><button class="btn btn-primary" type="button" style="width: 100%;border-radius: 10px;background: rgb(90,179,75);padding: 10px 30px;border: 1px solid rgb(90,179,75);" on:click={reloadWindow}>Still here!</button>
                </div>
            </div>
        </div>
    </div>
  </div>
  <div class="modal-backdrop show" />
</main>