const utils = require("../utils/utils");
let newsDB = require('../models/newsModel');
require('../config/mongoose')();
let constData = require('../const/constData');

const VNEXPRESS_BASE = "https://vnexpress.net";

const CATEGORY = {
    "thoi-su": "thời sự",
};

const crawler = async () => {
    try {
        getPostsData(constData.PAGE_LIMIT);
    } catch (error) {
        console.error(error);
    }
};

// go in specific post to get date information
const getDateTimeOfPost = async (url) => {
    try {
        let $ = await utils.fetchHtmlFromUrl(url);
        let datetime = $('span[class="date"]').text();
        datetime = datetime.split(",");

        let temp = datetime[1].trim().split("/");
        let day = temp[0];
        let month = temp[1] - 1;
        let year = temp[2];

        temp = datetime[2].trim().split(" ")[0].split(":");
        let hour = temp[0];
        let minute = temp[1];
        let date = new Date(year, month, day, hour, minute);

        return date;
    } catch (err) {
        console.error(err);
        let date = new Date();
        return date;
    }
};

const getPostsData = async (PAGE_LIMIT) => {
    Object.keys(CATEGORY).forEach(async (key) => {
        //PAGE_LIMIT is number of pages we want to crawl
        [...Array(PAGE_LIMIT)].forEach(async (_, i) => {
            let $ = await utils.fetchHtmlFromUrl(VNEXPRESS_BASE + "/" + key+'-p'+i);
            $("h3>a").each(async (i, el) => {
                //chu de
                let category = CATEGORY[key];
                //title
                let title = $(el).text();

                //link
                let link = $(el).attr("href");

                //datetime
                let datetime = await getDateTimeOfPost($(el).attr("href"));

                let news = { link: link, title: title, category: category, date: datetime };
                try{
                    await newsDB.create(news);
                }catch(error){
                    console.log(error);
                }
                
            });
        });
    });
};

crawler();
