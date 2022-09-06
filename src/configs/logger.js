import winston from 'winston';

class Logger{
    constructor(){
        this.init();
    }

    init(){
        if(process.env.NODE_ENV === "DEVELOPMENT"){
            this.logger = winston.createLogger({
                transports: [
                  new winston.transports.Console()
                ]
            });
        }else if(process.env.NODE_ENV === "PRODUCTION"){
            this.logger = winston.createLogger({
                transports: [
                  new winston.transports.File({ filename: 'combined.log' })
                ]
            });            
        }
    }
}


export default new Logger();