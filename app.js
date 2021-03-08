const twit = require('twit');
const fs = require('fs');
const config = require('./config.json');

const TWEET_HOUR = 17;

const T = new twit(config);
const text = fs.readFileSync('./text.txt', { encoding: 'utf-8' }).split('\n');
let { line } = JSON.parse(fs.readFileSync('./save.json', { encoding: 'utf-8' }))

async function tweet() {
	return new Promise(function (resolve, reject) {
		T.post('statuses/update', { status: text[line] }, function (err, tw, res) {
			console.log(`Ligne ${line + 1} tweetée.`);
			if (++line >= text.length)
				line = 0;
			fs.writeFileSync('./save.json', `{"line":${line}}`);
			console.log('Nouvelle ligne sauvegardée.');
			resolve();
		});
	});
}

let nextTweet = new Date();
if (new Date().getHours() >= TWEET_HOUR)
	nextTweet.setTime(Date.now() + 24 * 60 * 60 * 1000);
nextTweet.setHours(TWEET_HOUR, 0, 0, 0);

console.log(`Processus lancée, prochain tweet à : ${nextTweet}`);

setTimeout(async function () {
	await tweet();
	setInterval(tweet, 24 * 60 * 60 * 1000)
}, nextTweet.getTime() - Date.now())