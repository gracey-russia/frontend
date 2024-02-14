import React, { useState } from "react";
import './styles.css'
import { UserOutlined } from '@ant-design/icons';
import { Button, Input, Space, message, InputNumber, App } from 'antd';
import { useNavigate } from "react-router-dom";
import { auth, axios, tokenUpdate } from "../../lib/axios";

export const SMSPage: React.FC = () =>{
    const navigate = useNavigate()
    const [code, setCode] = useState('')
    const { message, notification, modal } = App.useApp();




    const onSendCodeClick = () => {
        if (code.length == 4){
            
                auth.post(
                    'auth/', 
                    {
                        phone_number: localStorage.getItem('tel'),
                        code: code
                    }
                ).then((r)=>{
                    message.open({
                            type: 'success',
                            content: 'Вход выполнен!',
                        });
                    localStorage.setItem('token', r.data.jwt_token)
                    tokenUpdate()
                    navigate('/'+r.data.role)
                    window.location.reload()
                }).catch((r)=>{
                     if(r.response.status == 400){
                        message.open({
                            type: 'error',
                            content: 'Введен неверный код',
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
                content: 'Введен неверный код',
            });
        }
    }

    const getCode = () =>{
        auth.post(
            'sign-in/', 
            {
                phone_number: localStorage.getItem('tel'),
            }
        ).then(
            (r)=>{
                if (r.status == 200){
                    message.open({
                        type: 'success',
                        content: 'Код успешно отправлен!',
                    })
                }
            }
        ).catch((r)=>{
            if(r.response.status == 400){
                message.open({
                   type: 'error',
                   content: 'Еще не прошло достаточно времени, чтобы запросить код еще раз. Пропробуйте через 1 минуту.',
               });
           }
           else{
            message.open({
                   type: 'error',
                   content: 'Возникла проблема на сервере, попробуйте позже или обратитесь в поддержку',
               });
           }
       })
    }
    const validateInput = (e:string) =>{
        let s = '0123456789'.split('')
        let flag = true
        e.split('').forEach(chr => {
            if (!(chr in s)){
                flag = false
            }
        });

        if (flag){
            setCode(e)
        }

        
    }

    if (code.length == 4){
        onSendCodeClick()
    }
    return <> 
    <div className="login-page">
        <div className="form-wrapper">
            
            <div style={{textAlign:'center'}}>
                <h2 className="h1">Введите код из СМС</h2>
                Мы отправили сообщение <br></br> с кодом подтверждения на ваш <br></br> номер:
                +7 ({localStorage.getItem('tel')?.slice(2,5)})-
                {localStorage.getItem('tel')?.slice(5, 8)}-
                {localStorage.getItem('tel')?.slice(8,10)}-
                {localStorage.getItem('tel')?.slice(10,localStorage.getItem('tel')?.length)}


            </div>
            <Input      
                        onPressEnter={()=>onSendCodeClick()}
                        placeholder="0000"
                        inputMode="numeric"
                        style={{width:'100%', textAlign:'center'}}
                        maxLength={4}
                        className="inputNumber" 
                        value={code} 
                        onChange={(e)=>validateInput(e.target.value)}
                ></Input>
            <Button size="small" onClick={()=>getCode()} >Отправить код еще раз</Button>
            <Button size="large" onClick={()=>onSendCodeClick()} type="primary">Подтвердить</Button>
            <div onClick={()=>navigate(-1)} style={{textAlign:'center', cursor:"pointer"}}>Назад</div>


        </div>
    </div>
    </>
}
