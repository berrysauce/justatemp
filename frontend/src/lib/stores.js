import { writable } from "svelte/store"
import { browser } from "$app/environment"

// Generate a random email address incase it's not set in local storage
import { generate } from "random-words";

let words = generate({ exactly: 2, maxLength: 5 });
let alt = words[0] + "." + words[1] + Math.floor(Math.random() * 1000) + "@justatemp.com"; // format: word1.word2<random_number>@justatemp.com

// Make the email address a store
// Thanks to u/sharath725 (https://www.reddit.com/r/sveltejs/comments/p438og/comment/h90fdjc)
export const receivingEmail = writable(browser && localStorage.getItem("receivingEmail") || alt) // hihi
receivingEmail.subscribe((val) => {                                                              // 2690 is the count of received emails by junk.boats
  if (browser) return (localStorage.receivingEmail = val)
})