import { Button, Input, message, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axios, userApi } from "../../lib/axios";
import { ApplicationIE, ApplicationCreateIE, CustomerInfoIE } from "../../types";
import { App } from 'antd';
import { LineComponent } from "../../components/LineComponent";
import { GraceyButton } from "../../components/GraceyButton";
import './styles.css'
const {TextArea} = Input

export const ApplicationCreate:React.FC = () =>{
    const { message, notification, modal } = App.useApp();
    const [appData, setAppData] = useState<ApplicationCreateIE>({
       care_type:'На несколько часов в день',
       time_start: 'Как можно скорее',
       contact_type: 'WhatsApp'
    })

    const navigate = useNavigate()

   

    const onEnter = () =>{
        axios.post('application/', appData).then(r=>{
            if (r.status == 201){
                message.success('Заявка создана!')
                navigate('/customer')
            }
        }).catch((r)=>{
            if (r.response.status != 200){
                message.error('Ошибка сервера')
            }
        }
        )
    }
    return <div className="application-create">
    <div className="application-create-header">
        <img src='/back.svg' style={{cursor:'pointer'}} onClick={()=>navigate(-1)} />
        Новая заявка
    </div>
    
    <div className="application-create-block">
        <LineComponent title="Вид ухода">
            <Select className="application-input" value={appData?.care_type} 
                        options={[
                            {value:'На несколько часов в день'},
                            {value:'C проживанием'}
                        ]}
                        onChange={(e)=>setAppData({
                            ...appData, 
                            care_type: e
                        }
                        )} 
            ></Select>
        </LineComponent>
        <LineComponent title='Когда сиделка должна приступить к работе?'>
            <Select className="application-input" value={appData?.time_start} 
                options={[
                    {value:'Как можно скорее'},
                    {value:'3-5 дней'},
                    {value:'Через 5 дней и более'}
                ]}
                onChange={(e)=>setAppData({
                    ...appData, 
                    time_start: e
                    })}
            ></Select>
        </LineComponent>
        <LineComponent title='Как с вами связаться?'>
            <Select className="application-input" value={appData?.contact_type} 
                        options={[
                            {value:'Позвоните мне'},
                            {value:'WhatsApp'},
                            {value:'Telegram'}
                        ]}
                        onChange={(e)=>setAppData({
                            ...appData, 
                            contact_type: e
                        }
                        )} 
                    ></Select>
        </LineComponent>
    </div>
    <div className="application-create-btns-wrapper">
        <GraceyButton size="large" type="primary" onClick={()=>onEnter()}>Отправить</GraceyButton>
        {/* <GraceyButton  onClick={()=>navigate(-1)}>Отменить</GraceyButton> */}
    </div>
 
    
    </div>
}