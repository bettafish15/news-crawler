const cheerio = require("cheerio");
const fetch = require('node-fetch');

const fetchHtmlFromUrl = async (url) => {
    const response = await fetch(url);
    const body = await response.text();
    let $ = cheerio.load(body);
    return $;
};



module.exports = {
    fetchHtmlFromUrl: fetchHtmlFromUrl,
};
