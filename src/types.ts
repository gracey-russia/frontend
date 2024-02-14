export interface User{
    role: 'nurse'|'customer',
    first_name:string, 
    last_name:string,
    jwt_token: string,
    linked_card?:string,
    token:string,
}

export interface CustomerInfoIE{
    customer_info:{
        region:string,
    }
    user:{
        email:string,
        first_name:string,
        last_name:string,
        role: string,
        linked_card?:string
        telegram_username:string
        token?:string
    }
}

export interface NurseInfoIE{
        user:{
                first_name:string,
                last_name:string,
                role:string,
                email:string,
                linked_card?:string
                username:string,
                telegram_username:string
        }
        nurse_info:{
                age:number, 
                citizenship:string,
                expirience:number,
                description:string
        }
}

export interface IntersectionUsersIE{
    user:{
        username:string,
        linked_card?:string,
        first_name:string,
        last_name:string,
        role:string,
        email:string,
        token:string,
    }
    nurse_info?:{
        age:number, 
        citizenship:string,
        expirience:number,
        description:string
    }, 
    customer_info?:{
        region:string,
    }
}

export interface OrderIE{
    id:string,
    application:string,
    care_type:string,
    nurse:string,
    address:string,
    cost:number,
    comment:string,
    status:string,
    client:string,
    days?: []
    cost_per_week:number,
    order_number:number
}

export interface ApplicationIE{
    user:string, 
    care_type:string,
    time_start:string,
    contact_type:string,
    id:string,
    active:Boolean
}

export interface ApplicationCreateIE{
    care_type:string,
    time_start:string,
    contact_type:string,
}


export interface VisitIE{
    completed: boolean,
    completed_date: number, 
    create_date: number,
    date: string,
    id:string,
    nursecomment:string,
    order: string,
    time_start:string,
    time_end:string,
    appelations: string[]
}

export interface VisitResponseIE{
    active_visits:{
        date:string,
        visits: VisitIE[]
    }[],
    completed_visits: VisitIE[]
}

export interface AppelationIE{
    id:string, 
    ans:string,
    comment: string,
    status: string, 
    visit: string
}