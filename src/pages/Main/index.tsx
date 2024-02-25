import { App } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokenUpdate, userApi } from "../../lib/axios";


export const MainPage:React.FC = () =>{
    const { message, notification, modal } = App.useApp();
    
    tokenUpdate()
    const navigate = useNavigate()
    useEffect(()=>{
        userApi.get('user_self_info/').then((r)=>{
            if (r.data.role == 'customer'){
                navigate('/customer')
            }else if(r.data.role == 'nurse'){
                navigate('/nurse')
            }
        }).catch(()=>{
            message.error('Ошибка сервера!')
        })
    })
    

    return <div></div>
}