import nodemailer from 'nodemailer';
import nodemailerhbs from 'nodemailer-express-handlebars';
import hbsConfig from '../configs/hbs';

class Mail{
    constructor(){

        this.transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST, 
            port:process.env.MAIL_PORT,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            }
        });

        this.configuraTemplates();
    }

    configuraTemplates(){
        this.transporter.use('compile',nodemailerhbs(hbsConfig));
    }

    sendMail(data){
        this.transporter.sendMail(data);      
    }
}

export default new Mail();