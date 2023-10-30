import React, { useState } from "react";
import './styles.css'
import { UserOutlined } from '@ant-design/icons';
import { Button, Input, Space, message, App } from 'antd';
import { useNavigate } from "react-router-dom";
import { auth, axios } from "../../lib/axios";

export const LoginPage: React.FC = () =>{
    const navigate = useNavigate()
    const [tel, setTel] = useState('')
    const [code, setCode] = useState('7')
    const { message, notification, modal } = App.useApp();

    const onLoginClick = () => {
        if (code.length >= 1 && tel.length == 10){
            
                auth.post(
                    'sign-in/', 
                    {
                        phone_number: '+' + code+tel
                    }
                ).then((r)=>{
                        message.open({
                            type: 'success',
                            content: 'Код отправлен',
                        });
                        localStorage.setItem('tel', '+' + code+tel)
                        navigate('/auth/sms')
                }).catch((r)=>{
                     if(r.response.status == 400){
                        message.open({
                            type: 'error',
                            content: 'Введите корректный номер телефона',
                        });
                    }
                    else{
                        message.open({
                            type: 'error',
                            content: 'Возникла проблема на сервере, попробуйте позже или обратитесь в поддержку',
                        });
                    }
                })
        } else{
            message.open({
                type: 'error',
                content: 'Введите корректный номер телефона',
            });
        }

    }
    return <> 
    <div className="login-page">
        <div className="form-wrapper">
            <h2 className="h1">Вход</h2>
            <Space.Compact className="input">
                <Input style={{ width: '27%', textAlign:'right'}} value={'+' + code} onChange={(e)=>setCode(e.target.value.slice(1))} />
                <Input value={tel} onChange={(e)=>setTel(e.target.value)} placeholder="9123456780" maxLength={10} style={{ width: '73%' }} defaultValue="26888888" />    
            </Space.Compact>
            <Button onClick={()=>onLoginClick()} type="primary">Войти</Button>
            {/* <Button onClick={()=>navigate('/auth/register')}> Зарегистрироваться</Button> */}
        </div>
    </div>
    </>
}
