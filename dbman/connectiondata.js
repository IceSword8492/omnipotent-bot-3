import DBMan from "../utils/dbman.js"

export default class ConnectionDataManager extends DBMan {
    static tablename = "connectionData";
    static columns = {id: this.types.text, nickname: this.types.text, backgroundColor: this.types.text, borderColor: this.types.text};

    static async create () {
        
    }
};