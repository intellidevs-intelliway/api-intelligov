import moment from "moment-timezone";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
import Log from "../configs/logger";
import Utils from "../helpers/Utils";
import mailService from "../services/Mail";
import User from "../models/User";

class AuthController{

    async store(req,res){
        //#swagger.tags = ['Auth']
        /*#swagger.requestBody = {
                in: 'body',
                description: 'Login user.',
                schema: {$ref: "#/definitions/Login"}
        } */
        const date = new Date();
        const now = moment.tz(date,'America/Sao_Paulo');
        try {
            const {email, password} = req.body;
            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({message:"Credenciais não válidas!"});
            }
            if(!user.actived || user.deleted){
                const situacao = user.deleted? "apagado": "desativado";
                Log.logger.warning({message:`Usuário ${user.name} (situação = ${situacao}) tentando se autenticar!`,date:now.format("YYYY-MM-DD HH:mm")});
                return res.status(400).json({message:"Credenciais não válidas!"});
            }
            const checkpassword = await bcryptjs.compare(password,user.password);
            if(!checkpassword){
                return res.status(400).json({message:"Credenciais não válidas!"});
            }
           
            const token = jwt.sign({},process.env.SECRET,{
                expiresIn:process.env.EXPIRESIN,
                subject:String(user.show())
            });
            Log.logger.info({message:`Usuário ${user.name} acaba de se autenticar!`,date:now.format("YYYY-MM-DD HH:mm")})
            return res.status(200).json({token});
        } catch (error) {
            Log.logger.error({message:error.message,date:now.format("YYYY-MM-DD HH:mm")});
            return res.status(500).json({ message: 'Esta requisição não possui retorno, foguete não tem ré!' });
        }
    }

    async recovery(req,res){
        //	#swagger.tags = ['Auth']
        /* #swagger.security = [{
            "bearerAuth": []
        }] */
        const date = new Date();
        const now = moment.tz(date,'America/Sao_Paulo');
        try {
            const {password, newPassword} = req.body;
            const user = await User.findById(req.userId);
            if(!user){
                return res.status(400).json({message:"Usuário inexistente!"});
            }
            const checkpassword = await bcryptjs.compare(password,user.password);

            if(!checkpassword){
                return res.status(400).json({message:"Credenciais não válidas!"});
            }
            const { senha, pass} = await Utils.generatePass(8,newPassword); 
            user.password = pass;

            await user.save();
            Log.logger.info({message:`Usuário ${user.name} acaba de alterar sua senha!`,date:now.format("YYYY-MM-DD HH:mm")})
            
            mailService.sendMail({
                from:process.env.MAIL_FROM,
                to:user.email,
                subject: "Troca de senha!",
                template:'alterpassword',
                context: {senha, nome:user.name}
            });
            Log.logger.info({message:`E-mail avisando traca de senha para o usuário ${user.name} acaba de ser enviado!`,date:now.format("YYYY-MM-DD HH:mm")})
            return res.status(200).json({message:"Senha alterada com sucesso!"});          
        } catch (error) {
            Log.logger.error({message:error.message,date:now.format("YYYY-MM-DD HH:mm")});
            return res.status(500).json({ message: 'Esta requisição não possui retorno, foguete não tem ré!' });
        }
    }

}

export default new AuthController();