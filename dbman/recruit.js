import DBMan from "../utils/dbman.js"

export default class RecruitManager extends DBMan {
    static tablename = "recruit";
    static columns = {messageId: this.types.text, count: this.types.integer};

    static async create (messageId, count) {
        this._insert({messageId, count});
    }

    static async update (messageId, count) {
        await this._update({count}, {messageId: `= '${messageId}'`});
    }

    static async delete (messageId) {
        await this._delete({messageId: `= '${messageId}'`});
    }
};