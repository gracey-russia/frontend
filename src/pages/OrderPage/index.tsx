import { App, Button, Space, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { VisitCard } from "../../components/VisitCard";
import { axios, userApi } from "../../lib/axios";
import { ApplicationIE, CustomerInfoIE, NurseInfoIE, OrderIE, VisitIE } from "../../types";
import './styles.css'


export const OrderPage:React.FC = () =>{
    let {order_id} = useParams()
    const [data, setData] = useState<OrderIE>()
    const [nurse, setNurse] = useState<NurseInfoIE>()
    const [customer, setCustomer] = useState<CustomerInfoIE>()
    const { message, notification, modal } = App.useApp();
    const [visits, setVisits] = useState<VisitIE[]>([])
    let location = useLocation();

    const navigate = useNavigate()
    const role  = location.pathname.split('/')[1]

    console.log(visits)
    
    useEffect( () =>{
        axios.get('order/'+order_id+'/').then((r)=>{
           setData(r.data)
            userApi.get('nurse_info/'+r.data.nurse+'/').then((r)=>{
               setNurse(r.data)
            }).catch((r)=>{
                if (r.status!= 200){
                    message.error('Ошибка сервера!')
                }
            }
            )
            axios.get('visit/order/'+r.data.id+'/').then((r)=>{
                console.log(r.data)
                setVisits(r.data)
             }).catch((r)=>{
                    if (r.status!= 200){
                        message.error('Ошибка сервера!')
                    }
                }
             )
            userApi.get('customer_info/'+r.data.client+'/').then((r)=>{
                setCustomer(r.data)
             }).catch((r)=>{
                 if (r.status!= 200){
                     message.error('Ошибка сервера!')
                 }
             }
             )
                
            
        }).catch((r)=>{
                if (r.status != 200){
                    message.error('Ошибка сервера!')
                }
            }
        )
    }, [setData])

    const onPaymentClick = () =>{
       let cost = 0

        axios.get('order/accept/' + data?.id + '/').then((r)=>{
            if (r.status == 200){
                var widget = new (window as any).cp.CloudPayments();


                widget.pay('auth', 
                { 
                    publicId: 'pk_a2d44a7570fe7490cfe41bb85f660', 
                    description: 'Оплата заказа id:' + data?.id,
                    amount: r.data.cost, 
                    currency: 'RUB', 
                    accountId: data?.client, 
                    invoiceId: data?.id, 
                    email: customer?.user.email, 
                    skin: "mini", 
                    autoClose: 3, 
                    data: {
                        isNurse : 'False'
                    },
                    escrow: { 
                        startAccumulation: true, 
                        escrowType: 1,
                    }, 
                    payer: { 
                        firstName: customer?.user.first_name,
                        lastName:  customer?.user.last_name,
                        middleName: 'middlename',
                        address: data?.address,
                        city: customer?.customer_info.region,
                        country: 'RU',
                        phone: data?.client,
                    }
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
        }).catch((r)=>{
            if (r.response.status == 405){
                message.info(r.response.data.message)
            }else if (r.status != 200){
                message.error('Ошибка сервера!')
            }
        })

        
       
    }


    const moveToArchive = () =>{
        modal.confirm({
            title:'Вы точно хотите отказаться от Заказа?',
            content:'Обратно восстановить заказ можно будет только через менеджера',
            okText:'Да',
            cancelText: 'Отмена',

            onOk() {
                axios.get('order/to-archive/' + data?.id + '/').then((r)=>{
                    if (r.status == 200){
                        message.info('Заказ перемещен в архив')
                        window.location.reload()

                    }
                }).catch((r)=>{
                    if (r.response.status == 405){
                        modal.info({
                            title:'Действие невозможно',
                            content: r.response.data.message
                        })
                    }else if (r.status != 200){
                        message.error('Ошибка сервера!')
                    }
                })
            }
        })
    }


    return <>
    <div className="orderPageBackground">
        <div className="orderPage">
            <h2>Заказ на сиделку</h2>
            <Space><h4 style={{margin:'0px'}}>Номер заказа: </h4> {data?.order_number}</Space>
            <Space><h4 style={{margin:'0px'}}>Статус заказа: </h4>  {
                    role == 'nurse'?
                    <Tag color={ data?.status == 'В архиве'? "#2db7f5" : '#87d068' }>{ data?.status == 'В архиве'? "В архиве" : 'Активный'}</Tag>
                    :
                    <Tag color={
                        data?.status == 'Ожидание оплаты'? 
                        '#f50': data?.status == 'Активный'? 
                        '#87d068':"#2db7f5"
                    }>{data?.status}</Tag>
                }</Space>

            

            <div className="orderPageWrapper">
                <Space direction="vertical">
                    <h3>О заказе</h3>
                    <Space><h4 style={{margin:'0px'}}>Тип ухода: </h4> {data?.care_type}</Space>
                    <Space><h4 style={{margin:'0px'}}>Адрес: </h4> {data?.address}</Space>
                    <Space><h4 style={{margin:'0px'}}>Стоимость посещения: </h4> {data?.cost} рублей</Space>
                    <Space><h4 style={{margin:'0px'}}>Стоимость за неделю: </h4> {data?.cost_per_week} рублей</Space>

                    <Space><h4 style={{margin:'0px'}}>Комментарий: </h4> {data?.comment}</Space>
                    {
                        data?.days == undefined? '':<h3>Дни посещений</h3>
                    }
                    {
                        data?.days == undefined? ''
                        :
                        data?.days.map((el, index)=>
                            <Space><h4 style={{margin:'0px'}}>{el[0]}</h4> {el[1]} - {el[2]}</Space>
                        )
                    }
                </Space>
                    {
                        role == 'nurse'?  <Space direction="vertical">
                                <h3>О клиенте</h3>
                                <Space><h4 style={{margin:'0px'}}>Имя: </h4> {customer?.user.first_name + ' ' + customer?.user.last_name}</Space>
                                <Space><h4 style={{margin:'0px'}}>Телефон: </h4> {data?.client}</Space>
                                <Space><h4 style={{margin:'0px'}}>E-mail: </h4> {customer?.user.email} </Space>
                                <Space><h4 style={{margin:'0px'}}>Регион: </h4> {customer?.customer_info.region}</Space>
                                {
                                    data?.care_type == 'C проживанием'? "": <>
                                        <h3>Посещения</h3>
                                        <div className="visitsWrapper">
                                            {
                                                visits.map((visit, index)=><VisitCard {...visit}></VisitCard>)
                                            }
                                        </div>
                                    </>
                                }
                               
                               
                        </Space>
                        :
                        <Space direction="vertical">
                            <h3>О Cиделке</h3>
                            <Space><h4 style={{margin:'0px'}}>Имя: </h4> {nurse?.user.first_name + ' ' + nurse?.user.last_name}</Space>
                            <Space><h4 style={{margin:'0px'}}>Телефон: </h4> {data?.nurse}</Space>
                            <Space><h4 style={{margin:'0px'}}>Возраст: </h4> {nurse?.nurse_info.age} лет/года</Space>
                            <Space><h4 style={{margin:'0px'}}>Опыт работы: </h4> {nurse?.nurse_info.expirience}</Space>
                            <Space><h4 style={{margin:'0px'}}>Гражданство: </h4> {nurse?.nurse_info.citizenship}</Space>
                            <Space><h4 style={{margin:'0px'}}>Описание: </h4> {nurse?.nurse_info.description}</Space>
                            {
                                data?.care_type == 'C проживанием'? "": <>
                                    <h3>Посещения</h3>
                                    <div className="visitsWrapper">
                                        {
                                            visits.map((visit, index)=><VisitCard {...visit}></VisitCard>)
                                        }
                                    </div>
                                </>
                            }
                            
                        
                        </Space>
                    }
                  

             
            </div>
            
            <div className="applicationPageBtns">
                {
                    data?.status == 'Ожидание оплаты' &&  role == 'customer'? 
                    <Button onClick={()=>onPaymentClick()} size="large" type="primary">Оплатить заказ</Button> 
                    :''
                }
                {
                    data?.status != 'В архиве'  &&  role == 'customer' ?
                    <Button onClick={()=>moveToArchive()}>Отказаться от заказа</Button>:''

                }
                <Button onClick={()=>navigate(-1)} >Закрыть окно</Button>
            </div>
        </div>
    </div>
    </>
}