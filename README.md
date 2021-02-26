# News-crawler (in development...)
## _A simple news crawler that fetching post's link and date_

news crawler is a concept news crawler that crawls dantri, vnexpress, v.v... for posts data link.
including api for fetching news's link by category order by date limit 10 posts and a websocket server
for live update fetching.

## Prequisites:
- Nodejs
- Mongodb

How to run the bot for crawling data and persists into mongoDB:
```sh
foo@bar:~$ git clone https://github.com/bettafish15/news-crawler.git
foo@bar:~$ cd news-crawler
foo@bar:~$ npm install --only=prod
foo@bar:~$ node spider/index.js
```

How to run the server to retrieve api end-point and live update feed:
```sh
foo@bar:~$ node bin\www
```


Mongodb will have following schema: 
```
link: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    title: {
        type: String,
        unique: false,
        required: false
    },
    category: {
        type: String,
        unique: false,
        required: false
    },
    date: { type: Date, default: Date.now, index: true },
```

To add another paper you need to create a new js file inside the spiders folder and implement the crawling method.
You need to include them to the index.js file inside the spiders folder too.


## Improvement that need to be implement (There are many.....)
   - Fix the queue getting block everytime crawling for date halfway through the queue (problem with the Crawler library, not finding reason yet). Can make another service that find all the documents in mongodb that doesnt have a date yet and crawling that site again.
   - Adding new site to crawl data is too hard and static right now, in need for a more dynamic way
   - Code improvement for easy maintaining.
