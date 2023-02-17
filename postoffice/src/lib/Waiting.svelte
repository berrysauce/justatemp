<script>
	export let receivingEmail;
</script>


<main>
    <div style="padding: 20px; margin-bottom: 20px; padding-right: 40px; padding-left: 40px;">
        <h4 class="text-center" style="font-family: Inter, sans-serif; letter-spacing: -0.5px; margin-top: 15vh;">
          <span class="spinner-border" role="status" style="border-width: 3px; margin-bottom: 10px; color: rgb(90, 179, 75);" /><br />
          Waiting for emails
        </h4>
        <!-- SSE is used by Cloudflare to hide data from potential bots -->
        <p class="text-center" style="margin-bottom: 0px;">
          As of now, we haven't received anything. It might take a few seconds before emails show up here. Make sure to address your emails to&nbsp;<!--sse-->
          <span class="font-monospace"><span style="background-color: rgba(255, 255, 255, 0);">{receivingEmail}</span></span>
          <!--/sse-->.
        </p>
    </div>
</main>