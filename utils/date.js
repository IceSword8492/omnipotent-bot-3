export default class DateUtil {
    get dateStr () {
        const date = new Date;
        return "" + date.getFullYear() + "/" + ("" + (date.getMonth() + 1)).padStart(2, "0") + "/" + ("" + date.getDate()).padStart(2, "0");
    }
    get timeStr () {
        const date = new Date;
        return ("" + date.getHours()).padStart(2, "0") + ":" + ("" + date.getMinutes()).padStart(2, "0") + ":" + ("" + date.getSeconds()).padStart(2, "0");
    }
};