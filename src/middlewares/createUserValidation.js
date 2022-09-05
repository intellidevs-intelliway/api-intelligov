import {body} from 'express-validator';
import User from '../models/User';

export default [
    body('fullname').notEmpty().withMessage('O campo nome é obrigatório!'),
    body('email').notEmpty().withMessage('O campo e-mail é obrigatório!').isEmail().withMessage('O campo e-mail não contem um e-mail válido!').custom(async (value) => {
        if(typeof(value)!=='undefined'){
            const user = await User.findOne({email:value})
            if (user) {
                return Promise.reject('E-mail já cadastrado');
            }
        }
    }),
    body('type').notEmpty().withMessage('O campo tipo é obrigatório!')
]
