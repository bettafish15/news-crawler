const spider = require("../utils/spider");
let newsDB = require("../models/newsModel");

let constData = require("../const/constData");

const VNEXPRESS_BASE = "https://vnexpress.net";

const CATEGORY = {
    "thoi-su": "Thời sự",
    "the-gioi": "Thế giới",
    "kinh-doanh": "Kinh doanh",
    "giai-tri": "Giải trí",
    "the-thao": "Thể thao",
    "phap-luat": "Pháp luật",
    "giao-duc": "Giáo dục",
    "suc-khoe": "Sức khỏe",
    "doi-song": "Đời sống",
    "du-lich": "Du lịch",
    "khoa-hoc": "Khoa học",
};

const crawler = async () => {
    try {
        let crawlerDetails = [];
        //get all category of the particular website
        Object.keys(CATEGORY).forEach((key) => {
            //PAGE_LIMIT is number of pages we want to crawl
            [...Array(constData.PAGE_LIMIT)].forEach(async (_, pageIndex) => {
                pageIndex += 1;
                crawlerDetails.push({
                    uri: VNEXPRESS_BASE + "/" + key + "-p" + pageIndex,
                    category: CATEGORY[key],
                    callback: getPostsData,
                });
            });
        });
        spider.queue(crawlerDetails);
    } catch (error) {
        console.error(error);
    }
};

const getPostsData = (error, res, done) => {
    if (error) {
        console.error(error);
    } else {
        let $ = res.$;
        $('h3[class="title-news"]>a').each(async (i, el) => {
            //chu de
            let category = res.options.category;
            //title
            let title = $(el).text();

            //link
            let link = $(el).attr("href");
            try {
                let news = {
                    link: link,
                    title: title,
                    category: category,
                    date: null,
                };
                await newsDB.create(news);
                crawlerDetails = {
                    uri: link,
                    callback: getDateTimeOfPost,
                };
                spider.queue([crawlerDetails]);
            } catch (error) {
                if (error.code == 11000) {
                    console.log("Already exists in database");
                    crawlerDetails = {
                        uri: link,
                        callback: getDateTimeOfPost,
                    };
                    spider.queue([crawlerDetails]);
                } else {
                    console.log(error.code);
                }
            }
        });
    }
    done();
};

// go in specific post to get date information
const getDateTimeOfPost = async (error, res, done) => {
    if (error) {
        console.error(error);
    } else {
        let $ = res.$;
        try {
            let datetime = $('span[class="date"]').text();
            datetime = datetime.split(",");
            if(!datetime){
                return;
            }

            let temp = datetime[1].trim().split("/");
            let day = temp[0];
            let month = temp[1] - 1;
            let year = temp[2];

            temp = datetime[2].trim().split(" ")[0].split(":");
            let hour = temp[0];
            let minute = temp[1];

            let date = new Date(year, month, day, hour, minute);
            try {
                await newsDB.updateOne(
                    { link: res.request.uri.href },
                    { date: date }
                );
            } catch (error) {
                console.error(error);
            }
        } catch (err) {
            
        }
    }
    done();
};

crawler();
