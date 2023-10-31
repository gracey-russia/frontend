import { App, Button, Tabs, TabsProps } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ApplicationCard } from "../../components/ApplicationCard";
import { OrderCard } from "../../components/OrderCard";
import { axios, userApi } from "../../lib/axios";
import { ApplicationIE, CustomerInfoIE, OrderIE } from "../../types";
import './style.css'

export const CustomerPage:React.FC = () =>{
    const [user, setUser] = useState<CustomerInfoIE>()
    const [applications, setApplications] = useState<ApplicationIE[]>([])
    const [orders, setOrders] = useState<OrderIE[]>([])
    const navigate = useNavigate()
    const { message, notification, modal } = App.useApp();

    if (localStorage.getItem('token') == null){
        navigate('/auth/login')
    }


    useEffect( () =>{
        
        userApi.get('customer_info/').then((r)=>{
            setUser(r.data)
        }).catch((r_)=>{
            if(r_.response.status == 404){
                navigate('customer_form')
            }
        }
        )
    }, [setUser])

    useEffect( () =>{
        axios.get('application/').then((r)=>{
            let activeApplications:ApplicationIE[] = [];
            (r.data as any).forEach((app:ApplicationIE) => {
                if (app.active){
                    activeApplications.push(app)
                }
            })
            setApplications(activeApplications)
        }).catch((r)=>{
            if (r.status != 200){
                message.error('Ошибка сервера!')
            }
        }
        )
    }, [setApplications])

    useEffect( () =>{
        axios.get('order/').then((r)=>{
            setOrders(r.data as any)
        }).catch((r)=>{
            if (r.status != 200){
                message.error('Ошибка сервера!')
            }
        }
        )
    }, [setOrders])



    const onChange = () =>{

    }

    const items: TabsProps['items'] = []
    if (applications.length > 0){
        items.push(
            {
                key:'0',
                label: 'Заявки',
                children: applications.map((application)=><ApplicationCard  {...application}></ApplicationCard>)
            }
        )
    }

    let archiveOrders:OrderIE[] = []
    let activeOrders:OrderIE[]  = []

    orders.map((order)=>{
        if (order.status == 'В архиве'){
             archiveOrders.push(order)
        } else{
            activeOrders.push(order)
        }
    })
    if (activeOrders.length > 0){
        items.push(
            {
                key:'1',
                label:'Активные заказы',
                children:  <div className="orderWrapper">{
                    activeOrders.map((order)=><OrderCard {...order}></OrderCard>)
                }
                </div>
            }
        )
    }

    if (archiveOrders.length > 0){
        items.push(
            {
                key:'2',
                label:'Архив заказов',
                children: <div className="orderWrapper">
                        {
                            archiveOrders.map((order)=><OrderCard {...order}></OrderCard>)
                        }
                </div>
                }
        )
    }




    return <>
    <Outlet/>
    <div className="customerPage">
        <Button type='primary' onClick={()=>navigate('application/create')}>Создать заявку на сиделку</Button>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

    </div>
    </>
}