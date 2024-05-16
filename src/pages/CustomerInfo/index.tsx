import { Button, Checkbox, Input, message, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../lib/axios";
import { CustomerInfoIE } from "../../types";
import { App } from 'antd';
import './styles.css'
import { GraceyButton } from "../../components/GraceyButton";
import { LineComponent } from "../../components/LineComponent";
export const CustomerInfoPage:React.FC = () =>{
    const { message, notification, modal } = App.useApp();
    const [userData, setUser] = useState<CustomerInfoIE>({
        customer_info:{
            region:'Москва',
        },
        user:{
            email:'',
            first_name:'',
            last_name:'',
            role: 'customer',
            telegram_username:'',
        }
    })
    const [isNew, setNew] = useState(false)
    const [acceptRules, setAcceptRules] = useState(false)
    const navigate = useNavigate()

    useEffect( () =>{
        userApi.get('customer_info/').then((r)=>{
            setUser(r.data as CustomerInfoIE)
            setAcceptRules(true)
        }).catch((r)=>{
            setNew(true)
            setAcceptRules(false)
            console.log('ERR, пользователь не найден')
        })
    }, [setUser]) 

    const onSave = () =>{
        if (acceptRules){
            if(isNew){
                userApi.post('customer_info/', userData).then((r)=>{
                    if (r.status == 200){
                        message.success('Ваши данные успешно сохранены')
                        navigate('/customer')
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
                userApi.put('customer_info/', userData).then((r)=>{
                    if (r.status == 200){
                        message.success('Ваши данные успешно сохранены')
                        navigate('/customer')
                        window.location.reload()
                    }
                }).catch((r)=>{
                    message.error('Введите валидные данные, произошла ошибка на сервере')
                })
            }
        } else{
            message.warning('Подтвердите правила пользования')
        }
       
    }
    return <div className="customer-info">
            <div className="customer-info-header">
                <img style={{cursor:'pointer'}} onClick={()=>navigate(-1)} src='/back.svg'></img>
                Редактирование профиля
            </div>
            <div className="customer-info-card">
                <LineComponent title="Имя">
                         <Input className="customer-info-input" value={userData?.user.first_name} 
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
                </LineComponent>
                <LineComponent title="Фамилия">
                    <Input className="customer-info-input" value={userData?.user.last_name} 
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
                </LineComponent>
                <LineComponent title='Телеграм username'>
                    <Space.Compact style={{width:'100%'}}><Input style={{ width: '10%'}} className="customer-info-input" value='@' disabled={true} />
                    <Input className="customer-info-input" value={userData?.user.telegram_username} 
                         style={{ width: '100%'}}
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
                    </Space.Compact>
                </LineComponent>         
                <h6>*Телеграм нужен для уведомлений</h6>
                <LineComponent title="E-mail">
                    <Input className="customer-info-input" type="email" value={userData?.user.email} 
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
                </LineComponent>
                <h6>*Почта нужна для экстренной связи, обещаем не спамить) </h6>
                <LineComponent  title="Регион">
                    <Select
                        showSearch
                        className="customer-info-input"
                        style={{ width: '100%' }}
                        options={[
                            {value:'Москва'},
                            {value:'Московская область'}
                        ]}
                        onChange={(e:any)=>setUser({
                            ...userData, 
                            customer_info:{
                                ...(userData.customer_info),
                                region: e
                            }
                        }
                        )} 
                        defaultValue={userData.customer_info.region}
                    ></Select>
                </LineComponent>
                <Checkbox checked={acceptRules} onChange={()=>setAcceptRules(!acceptRules)}>Ознакомлен с<a href='https://gracey.ru/agree'> правилами сервиса</a></Checkbox>
            </div>
            <div className="customer-info-btn-wrapper">
                <GraceyButton type="primary" onClick={()=>onSave()}>Сохранить</GraceyButton>
                <GraceyButton onClick={()=>navigate(-1)}>Отменить</GraceyButton>
            </div>
        </div>
}