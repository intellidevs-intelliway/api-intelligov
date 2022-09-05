import {Schema, model} from 'mongoose';

const SchemaTypes = Schema.Types;

const CompanyAddress = new Schema({
    cep:{
        type:String,
        required:false
    },
    street:{
        type:String,
        required:false
    },
    number:{
        type:String,
        required:false
    },
    complement:{
        type:String,
        required:false
    },
    neighborhood:{
        type:String,
        required:false
    },
    city:{
        type:String,
        required:false
    },
    state:{
        type:String,
        required:false
    }
});

const CompanyPartners = new Schema({
    fullname:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    },
    partner_type:{
        type:String,
        enum: ['Físico','Jurítico'],
        default: 'Físico'
    },
    minimum_exclusion:{
        type:Number,
        default:0
    }
});

const CompanyShareCapital = new Schema({
    share_capital:{
        type:SchemaTypes.Decimal128,
        default:0.0
    },
    number_shares:{
        type:Number
    },
    form_integration:{
        type:String,
        enum: ['Dinheiro','Imóvel','Outro'],
        default: 'Dinheiro'
    },
    describe_payment:{
        type:String
    },
    assignment_quotas :{
        type:Boolean
    },
    tag_along :{
        type:Boolean
    },
    drag_along :{
        type:Boolean
    },
    clause9:[
        {
            type:String
        }
    ]
});

const CompanyIncreaseShareCapital = new Schema({
    exclusion_preemptive :{
        type:Boolean
    },
    reason:{
        type:String
    }
});

const CompanyAdministration = new Schema({
    responsible_company:{
        type:String,
        enum: ['Conselho de administração + Diretoria','Apenas Diretoria'],
        default: 'Apenas Diretoria'
    },
    number_members_advice:{
        types:Number
    },
    term_office_advice:{
        types:Number
    },
    number_members_board:{
        types:Number
    },  
    term_office_board:{
        types:Number
    },
    items_board_directors:[
        {
            type:String
        }
    ]
});

const CompanySocialExercise = new Schema({
    start_date:{
        type:Date
    },
    end_date:{
        type:Date
    },
    intermediate_balance:{
        type:Boolean
    },
    mandatory_dividend_shareholders:{
        type:Boolean
    },
    periodicity_number:{
        type:Number
    },
    periodicity_type:{
        type:String,
        enum: ['Semanas','Meses', 'Anos'],
        default: 'Anos'
    }
});

const CompanyConflictFesolution = new Schema({
    arbitration_provision:{
        type:Boolean
    },
    arbitration_chamber:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    }
});

const CompanySchema = new Schema({
    user_id:{
        type:SchemaTypes.ObjectId,
        ref:"User",
        required:false
    },
    document:{
        type:String,
        required:true
    },
    social_reason:{
        type:String,
        required:true
    },
    fantasy_name:{
        type:String,
        required:false
    },
    logo:{
        type:String,
        required:false
    },    
    type_contract:{
        type:String,
        enum: ['LTDA','Unipessoal','S/A'],
        default: 'LTDA'
    },
    expected_incorporation:{
        type:Date,
        required:false
    },
    contract_duration:{
        type:String,
        enum: ['Indeterminado','Determinado'],
        default: 'Indeterminado'
    },
    email:{
        type:String,
        required:false
    },
    telephone:{
        type:String,
        required:false
    },
    address:{
        type:CompanyAddress
    },
    primary_activity:{
        type:String,
        required:false
    },
    secondary_activities:[
        {type:String}
    ],
    partners:[
        {type:CompanyPartners}
    ],
    share_capital:{
        type:CompanyShareCapital
    },
    increase_capital:{
        type:CompanyIncreaseShareCapital
    },
    administration:{
        type:CompanyAdministration
    },
    social_exercise:{
        type:CompanySocialExercise
    },
    conflict_resolution:{
        type:CompanyConflictFesolution
    },
    actived:{
        type:Boolean,
        default:true
    },
    deleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
});

// CompanySchema.methods.show = function(){
//     return {
        
//     }
// }


export default model('Company',CompanySchema);