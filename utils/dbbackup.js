import fs from "fs"
import request from "request-promise"

export default class DBBackup {
    static async initialize () {
        let body = await request("https://online-storage.glitch.me/api/v1/users/sharo/buckets/omni3/database/main.db", {encoding: null}).catch(console.error);
        fs.writeFileSync("./database/main.db", body);
    }
    static async backup () {
        let body = fs.createReadStream("./database/main.db");
        await request({
            method: "POST",
            uri: "https://online-storage.glitch.me/api/v1/users/sharo/buckets/omni3/database/main.db",
            formData: {
                file: body
            }
        });
    }
}