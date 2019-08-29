import DBMan from "../utils/dbman.js"

export default class RecruitManager extends DBMan {
    static tablename = "recruit";
    static columns = {messageId: this.types.text, count: this.types.integer};

    static async create () {
        
    }
};