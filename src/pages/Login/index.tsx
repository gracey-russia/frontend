import React, { useEffect, useState } from "react";
import './styles.css'
import { UserOutlined } from '@ant-design/icons';
import { Button, Input, Space, message, App } from 'antd';
import { useNavigate } from "react-router-dom";
import { auth, axios } from "../../lib/axios";
import { GraceyButton } from "../../components/GraceyButton";

export const LoginPage: React.FC = () =>{
    const navigate = useNavigate()
    const [tel, setTel] = useState('')
    const [code, setCode] = useState('7')
    const { message, notification, modal } = App.useApp();



    useEffect(() =>{
        if (localStorage.getItem('token') != null){
            navigate('/')
        }
    })

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
    return <div className="login-page-wrapper"> 
        <img src='/login-pic.svg' className="login-pic"></img>      
        <div className="login-page">
                {/* <img className="grace-man" src='/grace_man.svg'></img>
                <img className="plantImg" src="/plant.svg"></img>
                <img className="clockImg" src="/clock.svg"></img> */}
            <a  href='https://gracey.ru' lang="ru-RU" className="login-logo" >GRAC<span  lang="ru-Ru" style={{color:'#d3e6ff'}}>EY</span></a>
            <div className="form-wrapper">
                    <h2 className="h1">Добро пожаловать!</h2>
                    <div className="login-text">Введите ваш номер телефона для входа</div>
                    <Space.Compact className="login-input">
                        <Input style={{ width: '17%', textAlign:'center', fontSize:'16px'}} value={'+' + code} onChange={(e)=>setCode(e.target.value.slice(1))} />
                        <Input onPressEnter={()=>onLoginClick()} value={tel} onChange={(e)=>setTel(e.target.value)} placeholder="Номер телефона" maxLength={10} style={{maxWidth:'350px', width: '83%', fontSize:'16px'}} defaultValue="26888888" />    
                    </Space.Compact>
                    <GraceyButton size="large" onClick={()=>onLoginClick()} type="primary">Войти</GraceyButton>
                    {/* <Button onClick={()=>navigate('/auth/register')}> Зарегистрироваться</Button> */}
            </div>
        </div>
    </div>
}
