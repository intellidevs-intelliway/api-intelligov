import mongoose from "mongoose";
import moment from "moment-timezone";
import Log from "./configs/logger.js";

class Database{
    constructor(){
        this.init();
    }

    init(){
        const date = new Date();
        const now = moment.tz(date,'America/Sao_Paulo');
        if( typeof(process.env.DB_CONNECTION) !== "undefined" && process.env.DB_CONNECTION !== ""){
            mongoose.connect(process.env.DB_CONNECTION,
            {useNewUrlParser:true, useUnifiedTopology:true}).then(()=>{
                Log.logger.info({message:"Sistema conectado ao banco de dados!",date:now.format("YYYY-MM-DD HH:mm")})
            }).catch(err=>{
                Log.logger.error({message:err.message,date:now.format("YYYY-MM-DD HH:mm")})
            });
        }
    }
}

export default new Database();