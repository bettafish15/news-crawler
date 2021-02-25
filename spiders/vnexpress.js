const utils = require("../utils/utils");
let newsDB = require('../models/newsModel');

let constData = require('../const/constData');

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
        getPostsData(constData.PAGE_LIMIT);
    } catch (error) {
        console.error(error);
    }
};

const getPostsData = async (PAGE_LIMIT) => {
    Object.keys(CATEGORY).forEach(async (key) => {
        //PAGE_LIMIT is number of pages we want to crawl
        [...Array(PAGE_LIMIT)].forEach(async (_, pageIndex) => {

            //page index starts from 1
            pageIndex+=1;
            let $ = await utils.fetchHtmlFromUrl(VNEXPRESS_BASE + "/" + key+'-p'+pageIndex);
            $('h3[class="title-news"]>a').each(async (i, el) => {
                //chu de
                let category = CATEGORY[key];
                //title
                let title = $(el).text();

                //link
                let link = $(el).attr("href");

                //datetime
                let datetime = await getDateTimeOfPost(link);

                let news = { link: link, title: title, category: category, date: datetime };
                try{
                    await newsDB.create(news);
                }catch(error){
                    if(error.code == 11000){
                        console.log('Already exists in database');
                    }else{
                        console.log(error.code);
                    }
                }
                
            });
        });
    });
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

crawler();
