const spider = require("../utils/spider");
let newsDB = require("../models/newsModel");

let constData = require("../const/constData");

const DANTRI_BASE = "https://dantri.com.vn";

const CATEGORY = {
    "su-kien": "Sự kiện",
    "xa-hoi": "Xã hội",
    "the-gioi": "Thế giới",
    "the-thao": "Thể thao",
    "lao-dong-viec-lam": "Việc làm",
    "suc-khoe": "Sức khỏe",
    "tam-long-nhan-ai": "Nhân ái",
    "kinh-doanh": "Kinh doanh",
    "bat-dong-san": "Bất động sản",
    "o-to-xe-may": "Xe ++",
    "suc-manh-so": "Sức mạnh số",
    "giao-duc-huong-nghiep": "Giáo dục",
    "van-hoa": "Văn hóa",
    "du-lich": "Du lịch",
    "giai-tri": "Giải trí",
    "phap-luat": "Pháp luật",
    "nhip-song-tre": "Nhịp sống trẻ",
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
                    uri:
                        DANTRI_BASE +
                        "/" +
                        key +
                        "/trang-" +
                        pageIndex +
                        ".htm",
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
        $('h3[class="news-item__title"]>a').each(async (i, el) => {
            //chu de
            let category = res.options.category;
            //title
            let title = $(el).text();

            //link
            let link = DANTRI_BASE + $(el).attr("href");
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
            let datetime = $('span[class="dt-news__time"]').text();
            if(!datetime){
                return;
            }
            // Thứ năm, 25/02/2021 - 15:52
            datetime = datetime.split(",");

            let temp = datetime[1].trim().split("-")[0].trim().split("/");
            let day = temp[0];
            let month = temp[1] - 1;
            let year = temp[2];

            temp = datetime[1].trim().split("-")[1].split(":");
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
