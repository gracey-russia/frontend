import { Button, Input, message, Select, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../lib/axios";
import { CustomerInfoIE } from "../../types";
import { App } from 'antd';

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
            role: 'customer'
        }
    })
    const [isNew, setNew] = useState(false)
    const navigate = useNavigate()

    useEffect( () =>{
        userApi.get('customer_info/').then((r)=>{
            setUser(r.data as CustomerInfoIE)
        }).catch((r)=>{
            setNew(true)
            console.log('ERR, пользователь не найден')
        })
    }, [setUser]) 

    const onSave = () =>{
        if(isNew){
            userApi.post('customer_info/', userData).then((r)=>{
                if (r.status == 200){
                    message.success('Ваши данные успешно сохранены')
                    navigate('/customer')
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
                }
            }).catch((r)=>{
                message.error('Введите валидные данные, произошла ошибка на сервере')
            })
        }
    }
    return <>
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <h2>Данные о Вас</h2>
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
        </Space>

        <Space>
            Регион <Select
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
        </Space>
        <Button type="primary" onClick={()=>onSave()}>Сохранить</Button>
        
    </Space>
    </>
}