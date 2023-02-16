// src/index.ts
import { Hono } from "hono"
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'

interface Env {
	POST_DB: KVNamespace
}

const app = new Hono<{ Bindings: Env }>()
const domain = "junk.boats"

// CHANGE CORS ORIGIN LATER
app.use("*", prettyJSON(), cors({
	origin: ["*"],
}))

// -------------------------

app.get("/", async (c) => {
	return c.text(`(⌐⊙‿⊙) Heyyo - I'm the Postmaster behind ${domain}. Incoming messages go here!`)
})

app.post("/post/incoming", async (c) => {
	// receive email trigger from Mailgun and store email data

	// count email for statistics
	let prev_count = await c.env.POST_DB.get("stats-count")
	if (prev_count === null) {prev_count = "0"};
	await c.env.POST_DB.put("stats-count", String(parseInt(prev_count)+1))

	// parse request body & request in KV
	const body = await c.req.parseBody()
	
	// may cause problems if multiple senders/recipients are listed (user1@example.com, user2@example.com)
	let sender = body["sender"]
	let recipient = body["recipient"]

	// generate random string (len = 8)
	const suffix = Math.random().toString(16).slice(2, 10);
	// make key address followed by suffix (user@example.com-8dh2m901)
	// suffix acts as the key, while the email is used for assignment
	const key = recipient + "-" + suffix
	
	// this data can be visualized with http://bin.mailgun.net/
	const data = {
		"suffix": suffix,
		"recipient": recipient,
		"sender": sender,
		"subject": body["Subject"],
		"content-plain": body["body-plain"],
		"content-html": body["stripped-html"],
		"timestamp": body["timestamp"],
		"date": body["date"]
	}

	// create DB entry with 2 hour exp. time (7200 secs)
	// Cloudflare KV only supports string as value
	await c.env.POST_DB.put(key, JSON.stringify(data), {expirationTtl: 7200})

	return c.json({"status": "ok", "code": 200, "msg": "Message received"})
})

app.get("/get/mail", async (c) => {
	// get a JSON list of all received emails for an address

	// parse address query
	const address = c.req.query("address")
	// and require query
	if (address === undefined) {
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

// -------------------------

export default app
