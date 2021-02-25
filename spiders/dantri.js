const utils = require("../utils/utils");
let newsDB = require('../models/newsModel');

let constData = require('../const/constData');

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
            let $ = await utils.fetchHtmlFromUrl(DANTRI_BASE + "/" + key+'/trang-'+pageIndex+'.htm');
            $('h3[class="news-item__title"]>a').each(async (i, el) => {
                //chu de
                let category = CATEGORY[key];
                //title
                let title = $(el).text();

                //link
                let link = DANTRI_BASE + $(el).attr("href");

                //datetime
                let datetime = await getDateTimeOfPost(link);

                let news = { link: link, title: title, category: category, date: datetime };
                try{
                    await newsDB.create(news);
                }catch(error){
                    console.log();
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
        let datetime = $('span[class="dt-news__time"]').text();
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

        return date;
    } catch (err) {
        console.error(err);
        let date = new Date();
        return date;
    }
};

crawler();
