import React, { useEffect, useState } from "react";
import './style.css'
import { LogoutOutlined, UserOutlined} from '@ant-design/icons';
import { App, Button, Drawer, Space, Spin } from "antd";
import { Outlet, useNavigate } from 'react-router-dom';
import { axios, userApi } from "../../lib/axios";
import { CustomerInfoIE, IntersectionUsersIE, NurseInfoIE } from "../../types";
export const RoleContext = React.createContext('customer')

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
                console.log(r_user)
                if (r_user.response.status == 404){
                    navigate(r.data.role + '/' + r.data.role + "_form/")
                } else if (r_user.response.status != 200){
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




    const onPaymentClick = () =>{
 
        var widget = new (window as any).cp.CloudPayments();


        widget.pay('auth', 
        { 
            publicId: 'pk_a2d44a7570fe7490cfe41bb85f660', 
            description: 'Подтверждение вашей карты для выплаты (' +user?.user.username + ")" ,
            amount: 10, 
            currency: 'RUB', 
            accountId: user?.user.username, 
            invoiceId: 'none', 
            email: user?.user.email, 
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
        <Drawer title="О вас" placement="right" onClose={()=>setOpenDrawer(false)} open={openDrawer}>
        <Space direction="vertical">
                
            <Space direction="vertical">
                <h2>Мой профиль</h2>
                <Space><h4 style={{margin:'0px'}}>ФИО: </h4>{user?.user.first_name + ' ' + user?.user.last_name}</Space>
                {
                    user?.user.role == 'customer'?   
                    <Space><h4 style={{margin:'0px'}}>E-mail: </h4>{user?.user.email}</Space> : ''

                }

                
                <Space><h4 style={{margin:'0px'}}>Привязка карты: </h4>{user?.user.token == '' ? 'Нет':'Да' }</Space>

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
                    <Space><h4 style={{margin:'0px'}}> Опыт работы:</h4>{user.nurse_info?.expirience}</Space>
                    <Space><h4 style={{margin:'0px'}}> Описание:</h4>{user.nurse_info?.description}</Space>
                </Space>
            }
            <Button type='primary' onClick={()=>onChangeClick()}> Изменить</Button>
            <div></div>
            <div></div>
            {
                user?.user.role == 'customer'? 
                    <>
                        <h3>Способ оплаты</h3>
                        {
                            user?.user.linked_card? <Button onClick={()=>setLinkedCard(false)}>Отказаться от автоплатежа</Button>
                            :
                            <Button onClick={()=>setLinkedCard(true)}>Использовать автоплатеж с карты</Button>
                        } 
                    </>
                :
                        <>
                        <h3>Способы выплат</h3>
                        {
                            user?.user.token == '' ? <Button onClick={()=>onPaymentClick()}>Подключить карту для вывода средств</Button>
                            :
                            <Button onClick={()=>onPaymentClick()}>Подключить другую карту для вывода средств</Button>
                        } 
                        </>
            }
           

            
        </Space>

      </Drawer>
        <div className="defaultPage">
            <header className="header">
                <div lang="ru-RU" className="logo" onClick={()=>navigate('/')}>GRAC<span  lang="ru-Ru" style={{color:'#d3e6ff'}}>EY</span></div>
                <div className="btnsWrapper">
                    {/* <Space><h3 style={{margin:'0px'}}>Баланс:</h3> {balance} руб.</Space> */}
                    <Button onClick={()=>logout()} ><LogoutOutlined /> Выйти</Button>
                    <Button type='primary' onClick={()=>setOpenDrawer(true)}><UserOutlined /> Профиль</Button>
                    {/* <img src='/menu.svg'></img> */}
                </div>
            </header>
            {/* <img className="grace-man-def" src='/grace_man.svg'></img> */}
            <img className="grace-girl-def" src='/grace-3.svg'></img>
            <div className="defaultPageWrapper">
                <RoleContext.Provider value={user == undefined? 'customer':user?.user.role}>
                    <Outlet/>
                </RoleContext.Provider>

            </div>
        </div>
    </>
}