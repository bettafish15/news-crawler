const utils = require("../utils/utils");

const VNEXPRESS_BASE = "https://vnexpress.net";

const CATEGORY = {
    "thoi-su": "thời sự",
};

const crawler = async () => {
    try {
        getPostsData();
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

const getPostsData = async () => {
    Object.keys(CATEGORY).forEach(async (key) => {
        let $ = await utils.fetchHtmlFromUrl(VNEXPRESS_BASE + "/" + key);
        $("h3>a").each(async (i, el) => {
            //chu de
            console.log(key);
            //title
            console.log($(el).text());

            //link
            console.log($(el).attr("href"));
            let datetime = await getDateTimeOfPost($(el).attr("href"));

            //date
            console.log(datetime);
        });
    });
};

crawler();
