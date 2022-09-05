import bcryptjs from "bcryptjs";
class Utils{
    async generatePass(size,password=""){
        const senha = password!== "" ? password : Math.floor(Math.random()*10000000)+10000000;
        const pass = await bcryptjs.hash(senha.toString(),size);
        return {senha:senha.toString(), pass}
    }
}


export default new Utils();