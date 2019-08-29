import DBMan from "../utils/dbman.js"

export default class MarkovManager extends DBMan {
    static tablename = "markov";
    static columns = {channelId: this.types.text, message: this.types.text, date: this.types.text};

    static async create () {

    }
};