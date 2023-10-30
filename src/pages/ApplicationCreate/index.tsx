import { Button, Input, message, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axios, userApi } from "../../lib/axios";
import { ApplicationIE, ApplicationCreateIE, CustomerInfoIE } from "../../types";
import { App } from 'antd';

const {TextArea} = Input

export const ApplicationCreate:React.FC = () =>{
    const { message, notification, modal } = App.useApp();
    const [appData, setAppData] = useState<ApplicationCreateIE>({
       care_type:'На несколько часов в день',
       time_start: '',
       contact_type: 'Позвоните мне'
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
    return <>
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <h2>Новая заявка на сиделку</h2>
        <Space>
            Вид ухода <Select value={appData?.care_type} 
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
        </Space>

        <Space>
            Как скоро вам нужна сиделка? <TextArea value={appData?.time_start} 
                   onChange={(e)=>setAppData({
                    ...appData, 
                    time_start: e.target.value
                    })}

                    placeholder="Введите ответ"
                    ></TextArea>
        </Space>

        <Space>
            Как с вами связаться <Select value={appData?.contact_type} 
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
        </Space>


        <Space>
            <Button type="primary" onClick={()=>onEnter()}>Отправить</Button>
            <Button onClick={()=>navigate(-1)}>Назад</Button>
        </Space>
        

    </Space>
    </>
}