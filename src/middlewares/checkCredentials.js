
import pkg from 'jsonwebtoken';
const { verify } = pkg;
import Log from "../configs/logger.js";

export default async function (req, res, next){
    
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({message:"Token inexistente!"});
    }

    const [,token] = authHeader.split(" ");

    try {
        const decoded = await verify(token,process.env.SECRET);
        const user = JSON.parse(decoded.sub);
        req.userId = user.id;
        return next();
    } catch (error) {
        const date = new Date();
        const now = moment.tz(date,'America/Sao_Paulo');
        Log.logger.error({message:error.message,date:now.format("YYYY-MM-DD HH:mm")});
        return res.status(401).json({ message: 'Token inexistente!' });
    }    
}