import { Button, Input, message, Select, Space, App, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../lib/axios";
import { NurseInfoIE } from "../../types";

const {TextArea} = Input
export const NurseInfoPage:React.FC = () =>{
    const { message, notification, modal } = App.useApp();
    const [userData, setUser] = useState<NurseInfoIE>({
        nurse_info:{
            age:0, 
            citizenship:'',
            expirience:0,
            description:''
        },
        user:{
            email:'',
            first_name:'',
            last_name:'',
            role: 'nurse',
            username: '',
            telegram_username:''
        }
    })
    const [isNew, setNew] = useState(false)
    const navigate = useNavigate()

    useEffect( () =>{
        userApi.get('nurse_info/').then((r)=>{
            setUser(r.data as NurseInfoIE)
        }).catch((r)=>{
            setNew(true)
            console.log('ERR, пользователь не найден')
        })
    }, [setUser]) 

    const onSave = () =>{
        console.log(userData)
        if(isNew){
            userApi.post('nurse_info/', userData).then((r)=>{
                if (r.status == 200){
                    message.success('Ваши данные успешно сохранены')
                    navigate('/nurse')
                    window.location.reload()
                }
            }).catch((r)=>{
                if (r.response.status == 400){
                    message.error('Неверный формат почты')
                } else{
                    message.error('Ошибка сервера, попробуйте позже')
                }
            })
        }else{
            userApi.put('nurse_info/', userData).then((r)=>{
                if (r.status == 200){
                    message.success('Ваши данные успешно сохранены')
                    navigate('/nurse')
                    window.location.reload()
                }
            }).catch((r)=>{
                message.error('Введите валидные данные, произошла ошибка на сервере')
            })
        }
    }
    
    const onPaymentClick = () =>{
 
                 var widget = new (window as any).cp.CloudPayments();
 
 
                 widget.pay('auth', 
                 { 
                     publicId: 'pk_a2d44a7570fe7490cfe41bb85f660', 
                     description: 'Подтверждение вашей карты для выплаты (' +userData.user.username + ")" ,
                     amount: 10, 
                     currency: 'RUB', 
                     accountId: userData.user.username, 
                     invoiceId: 'none', 
                     email: userData.user.email, 
                     skin: "mini", 
                     autoClose: 3, 
                     data: {
                         isNurse : 'True'
                     },
                     
                 },
                 {
                     onSuccess: function (options:any) {
                         console.log(options)
                         navigate('/')
                         window.location.reload()
                     },
                     onFail: function (reason:any, options:any) { 
                         console.log(reason)
                         console.log(options)
                         message.error('Оплата не прошла!')
                     },
                     onComplete: function (paymentResult:any, options:any) { 
                     }
                 }
                 )
             }


    return <>
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <h2>Мой профиль</h2>
        <Space>
            Имя <Input value={userData?.user.first_name} 
                    onChange={(e)=>setUser({
                        ...userData, 
                        user: {
                            ...(userData.user),
                            first_name:e.target.value
                        }
                    }
                    )} 
                    placeholder="Ваше имя"
                    ></Input>
        </Space>

        <Space>
            Фамилия <Input value={userData?.user.last_name} 
                    onChange={(e)=>setUser({
                        ...userData, 
                        user: {
                            ...(userData.user),
                            last_name:e.target.value
                        }
                    }
                    )} 
                    placeholder="Ваша фамилия"
                    ></Input>
        </Space> 
        <Space>
            Возраст <InputNumber value={userData?.nurse_info.age} 
                    onChange={(e)=>setUser({
                        ...userData, 
                        nurse_info: {
                            ...(userData.nurse_info),
                            age: Number(e as unknown as string)
                        }
                    }
                    )} 
                    placeholder="Ваш возраст"
                    ></InputNumber>
        </Space>

        {/* <Space>
            Почта <Input type="email" value={userData?.user.email} 
                    onChange={(e)=>setUser({
                        ...userData, 
                        user: {
                            ...(userData.user),
                            email:e.target.value
                        }
                    }
                    )} 
                    placeholder="E-mail адрес"
                    ></Input>
        </Space> */}
        <Space>
            Telegram username <Input value={userData?.user.telegram_username} 
                    onChange={(e)=>setUser({
                        ...userData, 
                        user: {
                            ...(userData.user),
                            telegram_username:e.target.value
                        }
                    }
                    )} 
                    placeholder="@username"
                    ></Input>
        </Space>
        <h6>*Telegram нужен для уведомлений</h6>
        <Space>
            Гражданство <Input type="email" value={userData?.nurse_info.citizenship} 
                    onChange={(e)=>setUser({
                        ...userData, 
                        nurse_info: {
                            ...(userData.nurse_info),
                            citizenship:e.target.value
                        }
                    }
                    )} 
                    placeholder="Гражданство"
                    ></Input>
        </Space>

        <Space>
            Ваш опыт <InputNumber value={userData?.nurse_info.expirience} 
                    onChange={(e)=>setUser({
                        ...userData, 
                        nurse_info: {
                            ...(userData.nurse_info),
                            expirience: Number(e as unknown as string)
                        }
                    }
                    )} 
                    placeholder="Опыт (лет)"
                    ></InputNumber>
        </Space>

        <Space>
            Ваше описание <TextArea rows={4} value={userData?.nurse_info.description} 
                    onChange={(e)=>setUser({
                        ...userData, 
                        nurse_info: {
                            ...(userData.nurse_info),
                            description:e.target.value
                        }
                    }
                    )} 
                    placeholder="Расскажите о себе"
                    ></TextArea>
        </Space>
        
        {/* <Button onClick={()=>onPaymentClick()}>Подтвердить карту для выплат</Button> */}
       
        <Button type="primary" onClick={()=>onSave()}>Сохранить</Button>
        
    </Space>
    </>
}