import { App, Button, Input, InputNumber, Space, Tabs, TabsProps } from 'antd'
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { OrderCard } from '../../components/OrderCard'
import { VisitCard } from '../../components/VisitCard'
import { axios, userApi } from '../../lib/axios'
import { NurseInfoIE, OrderIE, VisitResponseIE } from '../../types'
import './styles.css'

export const NursePage:React.FC = () =>{
    const [user, setUser] = useState<NurseInfoIE>()
    const [orders, setOrders] = useState<OrderIE[]>([])
    const [balance, setBalance] = useState(0)

    const [visits, setVisits] = useState<VisitResponseIE>({
        active_visits:[],
        completed_visits:[]
    })

    // const [summ, setSumm] = useState(0)

    const navigate = useNavigate()
    const { message, notification, modal } = App.useApp();

    useEffect( () =>{
        if (localStorage.getItem('token') == null){
            navigate('/auth/login')
        }
        axios.get('balance/').then((r)=>{
            setBalance(r.data.balance)
        }).catch((r)=>{
            if (r.status != 200){
                message.error('Ошибка сервера!')
            }
        })
        userApi.get('nurse_info/').then((r)=>{
            setUser(r.data)
        }).catch((r_)=>{
            if(r_.response.status == 404){
                navigate('nurse_form')
            }
        }
        )
    }, [setUser])

    

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

    useEffect( () =>{
        axios.get('visit/nurse/').then((r)=>{
            setVisits(r.data as any)
        }).catch((r)=>{
            if (r.status != 200){
                message.error('Ошибка сервера!')
            }
        }
        )
    }, [setVisits])





    const items: TabsProps['items'] = []
   

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


    let visitItems:TabsProps['items'] = []

    if (visits.active_visits.length > 0){
        let activeVisitItems : TabsProps['items'] = []
        visits.active_visits.forEach((visit, index)=>{
            activeVisitItems?.push({
                key:index.toString(),
                label: visit.date,
                children:  <div className="orderWrapper">
                    {
                        visit.visits.map((visit,index)=><VisitCard {...visit}></VisitCard>)
                    }
                </div> 
            })
        })
        visitItems.push(
            {
                key:'0',
                label:'Активные посещения',
                children:      <Tabs defaultActiveKey="0" items={activeVisitItems} />
    
            },
        )
    }

    if (visits.completed_visits.length > 0){
        visitItems.push(
            {
                key:'1',
                label:'Выполненные посещения',
                children:  <div className="orderWrapper">
                        {
                            visits.completed_visits.map((visit,index)=><VisitCard {...visit}></VisitCard>)
                        }
                </div>
    
            },
        )
    }


    const menuItems:TabsProps['items'] = [
        {
            key:'0',
            label:'Заказы',
            children:      <Tabs defaultActiveKey="1" items={items} />

        },
        {
            key:'1',
            label:'Посещения',
            children: <div className="orderWrapper">
                <Tabs defaultActiveKey="1" items={visitItems} />
            </div>
        }
        
    ]
    const onGetMoney = () =>{
        let summ = 0
        modal.confirm({
            title:'Вывод денег',
            content:<div>
                <Space>
                    <h4 style={{margin:'0px'}}>Сумма вывода:</h4>
                    <InputNumber min={0} max={balance} onChange={(e)=>summ=e as number} />               
                </Space>
            </div>,
            okText:'Вывести',
            cancelText: 'Отмена',
            onOk() {
                axios.post('balance/', {
                    sum:summ
                }).then((r)=>{
                    if (r.status == 200){
                        message.success(r.data.message)
                        window.location.reload()

                    }
                }).catch((r)=>{
                    if (r.response.status != 200){
                        message.error(r.response.data.message)
                    }
                })  
            }
        })

       
    }
    return <>
        <Outlet/>
        <div className="customerPage">
            <Button type='primary' onClick={()=>onGetMoney()}>Вывод денег</Button>
            <Tabs defaultActiveKey="0" items={menuItems} />
    </div>
    
    </>
}