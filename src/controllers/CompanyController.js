import Log from "../configs/logger.js"
import Company from "../models/Company.js";
import User from "../models/User.js";

class CompanyController{
    async list(req,res){
        //	#swagger.tags = ['Company']
        /* #swagger.security = [{
            "bearerAuth": []
        }] */
        const loggeduser = await User.findById(req.userId);
        const date = new Date();
        const now = moment.tz(date,'America/Sao_Paulo');
        let companies= [];
        const fantasy_name = req.query.fantasy_name;
        const pageSize = req.query.pageSize
        const page = req.query.page;
        const limit = parseInt(pageSize?pageSize:5);
        const offset = parseInt((page?(page-1):0)*limit);
        try {
            if(fantasy_name && loggeduser.type==='Administrador'){
                companies = await Company.find({fantasy_name, deleted:false}).limit(limit).skip(offset);
            }else if(fantasy_name && loggeduser.type!=='Administrador'){
                companies = await Company.find({fantasy_name, user_id:req.userId, deleted:false}).limit(limit).skip(offset);
            }else if(loggeduser.type==='Administrador'){
                companies = await Company.find({deleted:false}).limit(limit).skip(offset);
            }else{
                companies = await Company.find({deleted:false,user_id:req.userId}).limit(limit).skip(offset);
            }
            const count = companies.length;            
            // users = users.map(user=>{return user.show()});
            Log.logger.info({message:`Lista de empresas acessada por ${loggeduser.fullname}!`,date:now.format("YYYY-MM-DD HH:mm")})
            return res.status(200).json({data:companies,count, pageSize:limit, page:req.query.page?req.query.page:1})
        } catch (error) {
            Log.logger.error({message:error.message,date:now.format("YYYY-MM-DD HH:mm")});
            return res.status(500).json({ message: 'Esta requisição não possui retorno, foguete não tem ré!' });
        }
    }

    async store(req,res){
        //	#swagger.tags = ['Company']
        /* #swagger.security = [{
            "bearerAuth": []
        }] */
        const loggeduser = await User.findById(req.userId);
        const date = new Date();
        const now = moment.tz(date,'America/Sao_Paulo');
        try {
            const {company_id, part} = req.body;
            let company = null;
            let message = "Empresa criado com sucesso!";
            if(typeof(company_id)==="undefined"){
                company = await this.company(req.body);
            }
            switch (part) {
                case "partners":
                    company = await this.partners(req.body);
                    message = "Sócio(s) adicionado(s) com sucesso!"
                    break;
            
                case "sharecapital":
                    company = await this.sharecapital(req.body);
                    message = "Capital social adicionado com sucesso!"
                    break;
            
                case "incrasesharecapital":
                    company = await this.incrasesharecapital(req.body);
                    message = "Aumento de capital social adicionado com sucesso!"
                    break;
            
                case "administration":
                    company = await this.administration(req.body);
                    message = "Administração da sociedade adicionado com sucesso!"
                    break;
            
                case "socialexercise":
                    company = await this.socialexercise(req.body);
                    message = "Exercício social adicionado com sucesso!"
                    break;
            
                case "conflictfesolution":
                    company = await this.conflictfesolution(req.body);
                    message = "Resolução de conflito adicionado com sucesso!"
                    break;
            
                default:
                    break;
            }
            Log.logger.info({message:`${message} Ação feita pelo usuário ${loggeduser.fullname}!`,date:now.format("YYYY-MM-DD HH:mm")})
            return res.status(200).json({message});
        } catch (error) {
            Log.logger.error({message:error.message,date:now.format("YYYY-MM-DD HH:mm")});
            return res.status(500).json({ message: 'Esta requisição não possui retorno, foguete não tem ré!' });
        }
    }

    async company(data){
        const {user_id, document, social_reason, fantasy_name, logo, type_contract,
        expected_incorporation, contract_duration, email, telephone, address,
        primary_activity, secondary_activities } = data;

        let company = new Company();
        if(typeof(user_id)!=="undefined") company.user_id = user_id;
        if(typeof(document)!=="undefined") company.document = document;
        if(typeof(social_reason)!=="undefined") company.social_reason = social_reason;
        if(typeof(fantasy_name)!=="undefined") company.fantasy_name = fantasy_name;
        if(typeof(logo)!=="undefined") company.logo = logo;
        if(typeof(type_contract)!=="undefined") company.type_contract = type_contract;
        if(typeof(expected_incorporation)!=="undefined") company.expected_incorporation = expected_incorporation;
        if(typeof(contract_duration)!=="undefined") company.contract_duration = contract_duration;
        if(typeof(email)!=="undefined") company.email = email;
        if(typeof(telephone)!=="undefined") company.telephone = telephone;
        if(typeof(address)!=="undefined") company.address = address;
        if(typeof(primary_activity)!=="undefined") company.primary_activity = primary_activity;
        if(typeof(secondary_activities)!=="undefined") company.secondary_activities = secondary_activities;
        
        await company.save();

        return company

    }

    async partners(data){
        const {company_id, partners} = data;
        let company = await Company.findById(company_id);
        company.partners = partners;
        await company.save();

        return company;
    }

    async sharecapital(data){
        const {company_id, share_capital, number_shares, form_integration, describe_payment,
        assignment_quotas, tag_along, drag_along, clause9} = data;
        let company = await Company.findById(company_id);
        if(typeof(share_capital)!=="undefined") company.share_capital.share_capital = share_capital;
        if(typeof(number_shares)!=="undefined") company.share_capital.number_shares = number_shares;
        if(typeof(form_integration)!=="undefined") company.share_capital.form_integration = form_integration;
        if(typeof(describe_payment)!=="undefined") company.share_capital.describe_payment = describe_payment;
        if(typeof(assignment_quotas)!=="undefined") company.share_capital.assignment_quotas = assignment_quotas;
        if(typeof(tag_along)!=="undefined") company.share_capital.tag_along = tag_along;
        if(typeof(drag_along)!=="undefined") company.share_capital.drag_along = drag_along;
        if(typeof(clause9)!=="undefined") company.share_capital.clause9 = clause9;

        await company.save();

        return company;
    }

    async incrasesharecapital(data){
       const{company_id,exclusion_preemptive, reason} =data
       let company = await Company.findById(company_id);
       if(typeof(exclusion_preemptive)!=="undefined") company.increase_capital.exclusion_preemptive = exclusion_preemptive;
       if(typeof(reason)!=="undefined") company.increase_capital.reason = reason;
       await company.save();

        return company;
    }

    async administration(data){
        const{company_id, responsible_company, number_members_advice, term_office_advice,
        number_members_board, term_office_board, items_board_directors} =data
        let company = await Company.findById(company_id);
        if(typeof(responsible_company)!=="undefined") company.administration.responsible_company = responsible_company;
        if(typeof(number_members_advice)!=="undefined") company.administration.number_members_advice = number_members_advice;
        if(typeof(term_office_advice)!=="undefined") company.administration.term_office_advice = term_office_advice;
        if(typeof(number_members_board)!=="undefined") company.administration.number_members_board = number_members_board;
        if(typeof(term_office_board)!=="undefined") company.administration.term_office_board = term_office_board;
        if(typeof(items_board_directors)!=="undefined") company.administration.items_board_directors = items_board_directors;

        await company.save();
        return company;
    }

    async socialexercise(data){
        const{company_id, start_date, end_date, intermediate_balance, mandatory_dividend_shareholders,
        periodicity_number, periodicity_type} =data
        let company = await Company.findById(company_id);
        if(typeof(start_date)!=="undefined") company.social_exercise.start_date = start_date;
        if(typeof(end_date)!=="undefined") company.social_exercise.end_date = end_date;
        if(typeof(intermediate_balance)!=="undefined") company.social_exercise.intermediate_balance = intermediate_balance;
        if(typeof(mandatory_dividend_shareholders)!=="undefined") company.social_exercise.mandatory_dividend_shareholders = mandatory_dividend_shareholders;
        if(typeof(periodicity_number)!=="undefined") company.social_exercise.periodicity_number = periodicity_number;
        if(typeof(periodicity_type)!=="undefined") company.social_exercise.periodicity_type = periodicity_type;
        
        await company.save();
        return company;
    }

    async conflictfesolution(data){
        const{company_id,arbitration_provision, arbitration_chamber, city, state} =data
        let company = await Company.findById(company_id);
        if(typeof(arbitration_provision)!=="undefined") company.conflict_resolution.arbitration_provision = arbitration_provision;
        if(typeof(arbitration_chamber)!=="undefined") company.conflict_resolution.arbitration_chamber = arbitration_chamber;
        if(typeof(city)!=="undefined") company.conflict_resolution.city = city;
        if(typeof(state)!=="undefined") company.conflict_resolution.state = state;
        await company.save();
        return company;
    }
  
    async show(req,res){
        //#swagger.tags = ['Company']
        /* #swagger.security = [{
            "bearerAuth": []
        }] */
        const date = new Date();
        const now = moment.tz(date,'America/Sao_Paulo');
        try {
            const loggeduser = await User.findById(req.userId);
            const company = await Company.findById(req.params.id);
            if(!company){
                return res.status(400).json({message:"Empresa não encontrada!"});
            }
            if(loggeduser.type !=="Administrador" && company.user_id !== req.userId ){
                return res.status(400).json({message:"Empresa não encontrada!"});
            }
            Log.logger.info({message:`Empresa ${company.fantasy_name} acessado por ${loggeduser.fullname}!`,date:now.format("YYYY-MM-DD HH:mm")})
            return res.status(200).json(company)
        } catch (error) {
            Log.logger.error({message:error.message,date:now.format("YYYY-MM-DD HH:mm")});
            return res.status(500).json({ message: 'Esta requisição não possui retorno, foguete não tem ré!' });
        }
    }

    // async edit(req,res){
    //     //	#swagger.tags = ['User']
    //     /* #swagger.security = [{
    //         "bearerAuth": []
    //     }] */
    //     const date = new Date();
    //     const now = moment.tz(date,'America/Sao_Paulo');
    //     try {
    //         const loggeduser = await User.findById(req.userId);
    //         const user = await User.findById(req.params.id);
    //         if(!user){
    //             return res.status(400).json({message:"Usuário não encontrado!"});
    //         }
    //         const { fullname, email, type, actived } = req.body;
    //         if(typeof (fullname) !== 'undefined'){
    //             const names = fullname.split(' '); 
    //             user.fullname = fullname;
    //             user.name = names[0];
    //         } 
    //         if(typeof (email) !== 'undefined') user.email = email;
    //         if(typeof (type) !== 'undefined') user.type = type;
    //         if(typeof (actived) !== 'undefined') user.actived = actived;
    //         await user.save();
    //         Log.logger.info({message:`Usuário ${user.fullname} alterado por ${loggeduser.fullname}!`,date:now.format("YYYY-MM-DD HH:mm")})
    //         return res.status(200).json({id:user.id, message: 'Usuário alterado com sucesso!' });
    //     } catch (error) {
    //         Log.logger.error({message:error.message,date:now.format("YYYY-MM-DD HH:mm")});
    //         return res.status(500).json({ message: 'Esta requisição não possui retorno, foguete não tem ré!' });
    //     }
    // }

    async delete(req,res){
        //	#swagger.tags = ['Company']
        /* #swagger.security = [{
            "bearerAuth": []
        }] */
        const date = new Date();
        const now = moment.tz(date,'America/Sao_Paulo');
        try {
            const loggeduser = await User.findById(req.userId);
            const company = await Company.findById(req.params.id);
            if(!company){
                return res.status(400).json({message:"Usuário não encontrado!"});
            }
            if(loggeduser.type !=="Administrador" && company.user_id !== req.userId ){
                return res.status(400).json({message:"Empresa não encontrada!"});
            }

            company.actived =false;
            company.deleted = true;
            await company.save();
            Log.logger.info({message:`Empresa ${company.fantasy_name} apagado por ${loggeduser.fullname}!`,date:now.format("YYYY-MM-DD HH:mm")})
            return res.status(200).json({message: 'Empresa apagada com sucesso!' });
        } catch (error) {
            Log.logger.error({message:error.message,date:now.format("YYYY-MM-DD HH:mm")});
            return res.status(500).json({ message: 'Esta requisição não possui retorno, foguete não tem ré!' });
        }
    }
}

export default new CompanyController();