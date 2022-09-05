import moment from "moment-timezone";
import {validationResult} from 'express-validator'
import Log from "../configs/logger";
import Utils from "../helpers/Utils";
import User from "../models/User";
import mailService from "../services/Mail";

class UserController{
    async list(req,res){
        //	#swagger.tags = ['User']
        /* #swagger.security = [{
            "bearerAuth": []
        }] */
        const loggeduser = await User.findById(req.userId);
        const date = new Date();
        const now = moment.tz(date,'America/Sao_Paulo');
        let users= [];
        const name = req.query.name;
        const pageSize = req.query.pageSize
        const page = req.query.page;
        const limit = parseInt(pageSize?pageSize:5);
        const offset = parseInt((page?(page-1):0)*limit);
        try {
            if(name){
                users = await User.find({name, deleted:false}).limit(limit).skip(offset);
            }else{
                users = await User.find({deleted:false}).limit(limit).skip(offset);
            }
            const count = users.length;            
            users = users.map(user=>{return user.show()});
            Log.logger.info({message:`Lista de usuários acessada por ${loggeduser.fullname}!`,date:now.format("YYYY-MM-DD HH:mm")})
            return res.status(200).json({data:users,count, pageSize:limit, page:req.query.page?req.query.page:1})
        } catch (error) {
            Log.logger.error({message:error.message,date:now.format("YYYY-MM-DD HH:mm")});
            return res.status(500).json({ message: 'Esta requisição não possui retorno, foguete não tem ré!' });
        }
    }

    async store(req,res){
        //	#swagger.tags = ['User']
        /* #swagger.security = [{
            "bearerAuth": []
        }] */
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const date = new Date();
        const now = moment.tz(date,'America/Sao_Paulo');
        try {
            const { fullname, email, type } = req.body;
            const loggeduser = await User.findById(req.userId);
            const { senha, pass} = await Utils.generatePass(8);            
            const names = fullname.split(' ');            
            const user = await User.create({
                name:names[0],
                fullname,
                email,
                type,
                password:pass
             });
             Log.logger.info({message:`Usuário ${user.fullname} acaba de ser criado por ${loggeduser.fullname}!`,date:now.format("YYYY-MM-DD HH:mm")})
             
             mailService.sendMail({
                from:process.env.MAIL_FROM,
                to:email,
                subject: "Bem vindo!",
                template:'wellcome',
                context: {senha, nome:fullname, email:email}
            });
            Log.logger.info({message:`E-mail de boas vindas acaba de ser enviado para o usuário ${user.fullname}!`,date:now.format("YYYY-MM-DD HH:mm")})
            return res.status(200).json({message:'Usuário criado com sucesso!'});
        } catch (error) {
            Log.logger.error({message:error.message,date:now.format("YYYY-MM-DD HH:mm")});
            return res.status(500).json({ message: 'Esta requisição não possui retorno, foguete não tem ré!' });
        }
    }

    async show(req,res){
        //#swagger.tags = ['User']
        /* #swagger.security = [{
            "bearerAuth": []
        }] */
        const date = new Date();
        const now = moment.tz(date,'America/Sao_Paulo');
        try {
            const loggeduser = await User.findById(req.userId);
            const user = await User.findById(req.params.id);
            if(!user){
                return res.status(400).json({message:"Usuário não encontrado!"});
            }
            Log.logger.info({message:`Usuário ${user.fullname} acessado por ${loggeduser.fullname}!`,date:now.format("YYYY-MM-DD HH:mm")})
            return res.status(200).json(user)
        } catch (error) {
            Log.logger.error({message:error.message,date:now.format("YYYY-MM-DD HH:mm")});
            return res.status(500).json({ message: 'Esta requisição não possui retorno, foguete não tem ré!' });
        }
    }

    async edit(req,res){
        //	#swagger.tags = ['User']
        /* #swagger.security = [{
            "bearerAuth": []
        }] */
        const date = new Date();
        const now = moment.tz(date,'America/Sao_Paulo');
        try {
            const loggeduser = await User.findById(req.userId);
            const user = await User.findById(req.params.id);
            if(!user){
                return res.status(400).json({message:"Usuário não encontrado!"});
            }
            const { fullname, email, type, actived } = req.body;
            if(typeof (fullname) !== 'undefined'){
                const names = fullname.split(' '); 
                user.fullname = fullname;
                user.name = names[0];
            } 
            if(typeof (email) !== 'undefined') user.email = email;
            if(typeof (type) !== 'undefined') user.type = type;
            if(typeof (actived) !== 'undefined') user.actived = actived;
            await user.save();
            Log.logger.info({message:`Usuário ${user.fullname} alterado por ${loggeduser.fullname}!`,date:now.format("YYYY-MM-DD HH:mm")})
            return res.status(200).json({id:user.id, message: 'Usuário alterado com sucesso!' });
        } catch (error) {
            Log.logger.error({message:error.message,date:now.format("YYYY-MM-DD HH:mm")});
            return res.status(500).json({ message: 'Esta requisição não possui retorno, foguete não tem ré!' });
        }
    }

    async delete(req,res){
        //	#swagger.tags = ['User']
        /* #swagger.security = [{
            "bearerAuth": []
        }] */
        const date = new Date();
        const now = moment.tz(date,'America/Sao_Paulo');
        try {
            const loggeduser = await User.findById(req.userId);
            const user = await User.findById(req.params.id);
            if(!user){
                return res.status(400).json({message:"Usuário não encontrado!"});
            }
            user.actived =false;
            user.deleted = true;
            await user.save();
            Log.logger.info({message:`Usuário ${user.fullname} apagado por ${loggeduser.fullname}!`,date:now.format("YYYY-MM-DD HH:mm")})
            return res.status(200).json({message: 'Usuário apagado com sucesso!' });
        } catch (error) {
            Log.logger.error({message:error.message,date:now.format("YYYY-MM-DD HH:mm")});
            return res.status(500).json({ message: 'Esta requisição não possui retorno, foguete não tem ré!' });
        }
    }
}

export default new UserController();