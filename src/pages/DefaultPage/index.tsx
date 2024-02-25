import React, { useEffect, useState } from "react";
import './style.css'
import { LogoutOutlined, UserOutlined} from '@ant-design/icons';
import { App, Button, Drawer, Space, Spin, Switch } from "antd";
import { Outlet, useNavigate } from 'react-router-dom';
import { axios, userApi } from "../../lib/axios";
import { CustomerInfoIE, IntersectionUsersIE, NurseInfoIE } from "../../types";
import { GraceyButton } from "../../components/GraceyButton";
import { LineComponent } from "../../components/LineComponent";
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
                window.location.reload()
            }
        }).catch((r)=>{
            if (r.status != 200){
                message.error('Ошибка сервера!')
            }
        })

        setOpenDrawer(false)
    }
    useEffect( () =>{
        if (localStorage.getItem('token') == null){
            navigate('/auth/login')
            return
        }
        axios.get('balance/').then((r)=>{
            setBalance(r.data.balance)
        }).catch((r)=>{
            if (r.status != 200){
                message.error('Ошибка сервера!')
            }
        })
        userApi.get('user_self_info/').then((r)=>{
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
            description: 'Подтверждение вашей карты для выплаты (' +user?.user.username + "). \n\nДля привязки карты мы спишем незначительную сумму и сразу же ее вернем." ,
            amount: 11, 
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
        <Drawer width='500px' title="Профиль" placement="right" onClose={()=>setOpenDrawer(false)} open={openDrawer}>
        {
            user == undefined? 
                <Spin/>
            :
            <div className='info-block-wrapper'>
                <div className="info-block">
                    <LineComponent  title='ФИО'>
                        {user?.user.first_name + ' ' + user?.user.last_name}
                    </LineComponent>
                    <LineComponent title="Телефон">{user?.user.username}</LineComponent>
                    <LineComponent title="Telegram username">@{user?.user.telegram_username}</LineComponent>

                    {
                        user?.user.role == 'customer'?
                        <>
                            <LineComponent title="E-mail">{user?.user.email}</LineComponent>
                            <LineComponent title="Ваш регион">{user?.customer_info?.region}</LineComponent>
                        </>
                        : 
                        <>      
                                <LineComponent title="Возраст">{user.nurse_info?.age}</LineComponent>
                                <LineComponent title="Опыт работы">{user.nurse_info?.expirience}</LineComponent>
                                <LineComponent title="описание">{user.nurse_info?.description}</LineComponent>
{/* 
                                <Space><h4 style={{margin:'0px'}}> Возраст:</h4>{user.nurse_info?.age}</Space>
                                <Space><h4 style={{margin:'0px'}}> Опыт работы:</h4>{user.nurse_info?.expirience}</Space>
                                <Space><h4 style={{margin:'0px'}}> Описание:</h4>{user.nurse_info?.description}</Space> */}
                        
                        </>
                    }
                </div>

                <GraceyButton className="change-btn" type='primary' onClick={()=>onChangeClick()}> Изменить</GraceyButton>
                
               
                {
                    user?.user.role == 'customer'? 
                        <>
                            <div className="info-block">
                                <LineComponent title="Способ оплаты">
                                    <div className="pay-card-wrapper">
                                        <img 
                                            src={user.user.card_type == 'Visa'? 'visa.svg': user.user.card_type == 'MasterCard'? 'masterCard.svg':'mir.svg'}
                                        />
                                        {user.user.card_mask}
                                    </div>
                                </LineComponent>
                                <div className="card-text-wrapper">
                                        Сохранить банковскую карту для быстрой оплаты заказов
                                    <Switch checked={user?.user.linked_card? true:false} onChange={(checked)=>setLinkedCard(checked)} />
                                </div>
                                <div className="card-grey-text">
                                    Используем систему «Безопасная сделка». 
                                    После оплаты деньги будут зарезервированы банком — исполнитель получит деньги только после совершения сделки.
                                </div>
                            </div>
                        </>
                    :
                            <>
                            <h3>Способы выплат</h3>
                            {
                                user?.user.token == '' ? <GraceyButton onClick={()=>onPaymentClick()}>Подключить карту для вывода средств</GraceyButton>
                                :
                                <GraceyButton onClick={()=>onPaymentClick()}>Подключить другую карту для вывода средств</GraceyButton>
                            } 
                            </>
                }
       
                <div>
                    <div className="card-text-header">Чем мы можем вам помочь?</div>
                    <div className="card-grey-text">
                        Если у вас возникли вопросы — напишите нам любым, удобным вам способом.
                    </div>
                </div>
                <div className="drawer-btn-wrapper">
                    <a href="https://wa.me/79939110350"><GraceyButton className="WhatsAppBtn" type="primary" size="large" onClick={()=>null}>WhatsApp</GraceyButton></a>
                    <a href='https://t.me/Graceyrus'><GraceyButton className= "TelegramBtn" type="primary" size="large" onClick={()=>null}>Telegram</GraceyButton></a>
                </div>
               
            </div>



        }
      </Drawer>


        <div className="defaultPage">
            <header className="header">
                <div lang="ru-RU" className="logo" onClick={()=>navigate('/')}>GRAC<span  lang="ru-Ru" style={{color:'#d3e6ff'}}>EY</span></div>
                <div className="btnsWrapper">
                    {/* <Space><h3 style={{margin:'0px'}}>Баланс:</h3> {balance} руб.</Space> */}
                    <GraceyButton className="logout-btn" size='normal' onClick={()=>logout()} ><img src='/logout.svg'/> Выйти</GraceyButton>
                    <img className="profile-logo" src='/profile.svg' onClick={()=>setOpenDrawer(true)}/>
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