import React, { useEffect, useState } from "react";
import './style.css'
import { LogoutOutlined, UserOutlined} from '@ant-design/icons';
import { App, Button, Drawer, Space, Spin } from "antd";
import { Outlet, useNavigate } from 'react-router-dom';
import { axios, userApi } from "../../lib/axios";
import { CustomerInfoIE, IntersectionUsersIE, NurseInfoIE } from "../../types";

export const DefaultPage = () =>{
    const navigate = useNavigate()
    const [openDrawer, setOpenDrawer] = useState(false);
    const [user, setUser] = useState<IntersectionUsersIE>()
    const { message, notification, modal } = App.useApp();
    const [balance, setBalance] = useState(0)


    const logout = () =>{
        localStorage.clear()
        setUser(undefined)
        setBalance(0)
        navigate('/auth/login')
    }

    const onChangeClick = () =>{
        navigate(user?.user.role + '/' + user?.user.role + "_form/")
        setOpenDrawer(false)
    }

    const setLinkedCard = (flag:boolean) =>{
        userApi.post('/set_linked_card/', {action: flag? 'add':'delete'}).then((r)=>{
            if (r.status == 200){
                message.success('Действие с картой успешно!')
            }
        }).catch((r)=>{
            if (r.status != 200){
                message.error('Ошибка сервера!')
            }
        })

        setOpenDrawer(false)
        window.location.reload()
    }
    useEffect( () =>{
        axios.get('balance/').then((r)=>{
            setBalance(r.data.balance)
        }).catch((r)=>{
            if (r.status != 200){
                message.error('Ошибка сервера!')
            }
        })
        userApi.get('user_info/').then((r)=>{
            
            userApi.get(r.data.role+'_info/').then((r_user)=>{
                setUser(r_user.data)
            }).catch((r_user)=>{
                if (r_user.status == 404){
                    navigate(user?.user.role + '/' + user?.user.role + "_form/")                } else if (r_user.response.status != 200){
                    message.error('Ошибка сервера!')
                }
            })

        }).catch((r)=>{
            if (r.status != 200){
                message.error('Ошибка сервера!')
            }
        }
        )
    }, [setUser])

    return <>
        <Drawer title="О вас" placement="right" onClose={()=>setOpenDrawer(false)} open={openDrawer}>
        <Space direction="vertical">
                
            <Space direction="vertical">
                <h2>Общая информация</h2>
                <Space><h4 style={{margin:'0px'}}>ФИО: </h4>{user?.user.first_name + ' ' + user?.user.last_name}</Space>
                <Space><h4 style={{margin:'0px'}}>E-mail: </h4>{user?.user.email}</Space>
                <Space><h4 style={{margin:'0px'}}>Ваша роль: </h4>{user?.user.role}</Space>
                <Space><h4 style={{margin:'0px'}}>Привязка карты: </h4>{user?.user.linked_card? 'Да':'Нет' }</Space>

            </Space>
            
            {
                user == undefined? <Spin/>
                :
                user.user.role == 'customer'? 
                <Space direction='vertical'>
                    <Space><h4 style={{margin:'0px'}}>Ваш регион: </h4>{user.customer_info?.region}</Space>
                </Space>
                :
                <Space direction='vertical'>
                    <Space><h4 style={{margin:'0px'}}> Возраст:</h4>{user.nurse_info?.age}</Space>
                    <Space><h4 style={{margin:'0px'}}> Гражданство:</h4>{user.nurse_info?.citizenship}</Space>
                    <Space><h4 style={{margin:'0px'}}> Опыт работы:</h4>{user.nurse_info?.expirience}</Space>
                    <Space><h4 style={{margin:'0px'}}> Описание:</h4>{user.nurse_info?.description}</Space>
                </Space>
            }

            {
                user?.user.linked_card? <Button onClick={()=>setLinkedCard(false)}>Отвязать карту</Button>
                :
                <Button onClick={()=>setLinkedCard(true)}>Привязать карту</Button>
            }

            
            <Button type='primary' onClick={()=>onChangeClick()}> Изменить</Button>
        </Space>

      </Drawer>
        <div className="defaultPage">
            <header className="header">
                <div className="logo" onClick={()=>navigate('/')}>GRACE</div>
                <div className="btnsWrapper">
                    <Space><h3 style={{margin:'0px'}}>Баланс:</h3> {balance} руб.</Space>
                    <Button onClick={()=>logout()} ><LogoutOutlined /> Выйти</Button>
                    <Button type='primary' onClick={()=>setOpenDrawer(true)}><UserOutlined /> Профиль</Button>
                    {/* <img src='/menu.svg'></img> */}
                </div>
            </header>
            <div className="defaultPageWrapper">
                <Outlet/>
            </div>
        </div>
    </>
}