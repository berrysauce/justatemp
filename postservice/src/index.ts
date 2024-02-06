// src/index.ts
import { Hono } from "hono"
import { cors } from "hono/cors"
import { prettyJSON } from "hono/pretty-json"

interface Env {
	POST_DB: KVNamespace;
	DKIM_PRIVATE_KEY: string;
}

const app = new Hono<{ Bindings: Env}>()
const domain = "justatemp.com"

// CHANGE CORS ORIGIN LATER
app.use("*", prettyJSON(), cors({
	origin: ["*"],
}))

// -------------------------

app.get("/", async (c) => {
	return c.text(`(⌐⊙‿⊙) Heyyo - I'm the Post Service behind ${domain}. I handle all messages.`)
})

app.get("/mail/get", async (c) => {
	// get a JSON list of all received emails for an address

	// parse address query
	const address = c.req.query("address")
	// and require query
	if (address === undefined || address === "") {
		return c.json({
			"status": "bad request",
			"code": 400,
			"msg": "'address' query required!",
		})
	}

	// get mails with prefix (user@example.com) - suffix (-8dh2m901) acts as identifier
	const res = await c.env.POST_DB.list({ prefix: address });
	const stats_count = await c.env.POST_DB.get("stats-count")
	
	// if no emails are stored under the prefix key, return empty json
	if (res["keys"].length === 0) {
		return c.json({
			"status": "ok",
			"code": 200,
			"msg": "No available emails",
			"stats": {
				"count": stats_count,
			},
			"mails": []
		})
	}

	// create array of received mails
	let mails = []
	for (const key of res["keys"]) {
		const mail_res = await c.env.POST_DB.get(key["name"])
		// convert string back to JSON
		// @ts-ignore
		mails.push(JSON.parse(mail_res))
	}
	
	return c.json({
		"status": "ok",
		"code": 200,
		"msg": "Mail available",
		"stats": {
			"count": stats_count,
		},
		"mails": mails
	})
})

app.get("/mail/delete", async (c) => {
	// delete mail

	// get mail key (user@example.com-12345)
	const key = c.req.query("key")

	await c.env.POST_DB.delete(key)

	return c.json({
		"status": "ok",
		"code": 200,
		"msg": "Mail deleted"
	})
})

app.post("/mail/forward", async (c) => {
	// forward mail with Mailchannels via Cloudflare Workers

	// get mail key (user@example.com-12345) and forward address
	const data = await c.req.json()
	const key = data["key"]
	const forward = data["forward"]

	// get mail from key
	let mail = await c.env.POST_DB.get(key)

	// check if mail exists
	if (mail === null) {
		return c.json({
			"status": "error",
			"code": 500,
			"msg": "Mail not found"
		})
	}

	// check if forwarding to justatemp.com
	if (forward.includes("justatemp.com")) {
		return c.json({
			"status": "error",
			"code": 403,
			"msg": "Forwarding to justatemp.com is not allowed"
		})
	}

	// convert string back to JSON
	// @ts-ignore
	mail = JSON.parse(mail)

	// forward mail with Mailchannels
	// with the help of Exerra (https://blog.exerra.xyz/blog/send-emails-cf-workers-email-routing) ❤️
	const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
		method: "POST",
		headers: {
			"content-type": "application/json",
		},
		body: JSON.stringify({
			personalizations: [
				{
					to: [ { email: forward }], // who to send the email to, add your own recipient
					reply_to: { email: mail["from"] }, // who to reply to
					dkim_domain: "justatemp.com",
					dkim_selector: "mailchannels", // [selector]._domainkey.yourdomain.com
					dkim_private_key: c.env.DKIM_PRIVATE_KEY,
				}
			],
			from: {
				email: "forward@justatemp.com",
				name: `Just A Temp`,
			},
			subject: "📮 Forward – " + mail["subject"],
			reply_to: { email: mail["from"] },
			content: [
				{
					type: "text/plain",
					value: mail["content-plain"] + "\n \nForwarded by justatemp.com, yet another temporary email generator." + "\nIf you believe this is a mistake or the service is being abused, please contact us at security@justatemp.com.",
				},
			],
		}),
	})

	return c.json({
		"status": "ok",
		"code": 200,
		"msg": "Mail forwarded"
	})
})

// -------------------------

export default app
