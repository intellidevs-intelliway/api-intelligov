import {Schema, model} from 'mongoose';

const UserSchema = new Schema({
    fullname:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum: ['Administrador','Usuário','Jesus','Operador'],
        default: 'Usuário'
    },
    actived:{
        type:Boolean,
        default:true
    },
    deleted:{
        type:Boolean,
        default:false
    },
    token:{
        type:String
    },
    expiration:{
        type:String
    },
    status:{
        type:String,
        enum: ['online','offline','ocupado','ausente'],
        default:"offline"
    }
},{
    timestamps:true
});

UserSchema.methods.show = function(){
    return {
        id:this._id,
        name:this.name,
        email:this.email,
        type:this.type,
        actived:this.actived,
        deleted: this.deleted,
        status:this.status
    }
}


export default model('User',UserSchema);