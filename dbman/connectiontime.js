import DBMan from "../utils/dbman.js"

export default class ConnectionTimeManager extends DBMan {
    static tablename = "connectionTime";
    static columns = {userid: this.types.text, date: this.types.text, time: this.types.integer};

    static async create () {
        
    }
};