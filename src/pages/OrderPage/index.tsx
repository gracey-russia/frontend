import { App, Button, Space, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GraceyButton } from "../../components/GraceyButton";
import { LineComponent } from "../../components/LineComponent";
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
            <div className="order-page-header">
                <img style={{cursor:'pointer'}} onClick={()=>navigate(-1)} src='/back.svg' />
                <div>Заказ на сиделку</div>
            </div>
            {
                    role == 'nurse'?
                    <Tag color={ data?.status == 'В архиве'? "#2db7f5" : '#87d068' }>{ data?.status == 'В архиве'? "В архиве" : 'Активный'}</Tag>
                    :
                    <Tag color={
                        data?.status == 'Ожидание оплаты'? 
                        '#f50': data?.status == 'Активный'? 
                        '#87d068':"#2db7f5"
                    }>{data?.status}</Tag>
            }
            <div className="order-page-wrapper">
    
            <div className="order-block">
                <LineComponent title="Номер заказа">#{data?.order_number}</LineComponent>
                <LineComponent title="Вид ухода">{data?.care_type}</LineComponent>
                <LineComponent title="Адрес">{data?.address}</LineComponent>
            </div>

            {   role == 'customer'?
                        data?.care_type == 'На несколько часов в день'?
                        <div className="order-block">
                                <LineComponent title="Стоимость посещения">{data?.cost} рублей</LineComponent>
                                <LineComponent title="Стоимость за неделю">{data?.cost_per_week} рублей</LineComponent>

                        </div>
                        :
                        <div className="order-block">
                            <LineComponent title="Стоимость за неделю">{data?.cost} рублей</LineComponent>
                        </div>
                        : ''
            }
            <div className="order-block">
                <LineComponent title='Комментарий'>{data?.comment}</LineComponent>
            </div>
            {
                data?.days == undefined? '': data?.days.length == 0? '':
                <div className="order-block">
                    <LineComponent title='График'>
                        {
                            data?.days.map((el, index)=>
                                <LineComponent title={el[0]}> {el[1]} - {el[2]}</LineComponent>
                            )
                        }
                    </LineComponent>
                </div>

            }

            {   
                role == 'nurse'? <div className="order-classic-wrapper">
                        <div className="order-header">О клиенте</div>
                        <div className="order-block">
                            <LineComponent title="ФИО">{customer?.user.first_name + ' ' + customer?.user.last_name}</LineComponent>
                            <LineComponent title="Телефон">{data?.client}</LineComponent>
                            <LineComponent title="Регион">{customer?.customer_info.region}</LineComponent>
                        </div>
                </div>
                :
                <div  className="order-classic-wrapper">
                    <div className="order-header">О Сиделке</div>
                    <div className="order-block">
                        <LineComponent title="ФИО">{nurse?.user.first_name + ' ' + nurse?.user.last_name}</LineComponent>
                        <LineComponent title="Возраст">{nurse?.nurse_info.age} лет/года</LineComponent>
                        <LineComponent title="Опыт работы">{nurse?.nurse_info.expirience} лет/года</LineComponent>
                        <LineComponent title="Описание">{nurse?.nurse_info.description}</LineComponent>

                    </div>
                </div>
            }    
            {
                            data?.care_type == 'C проживанием'? "": <div className="order-classic-wrapper">
                                <div className="order-header">Посещения</div>
                                <div className="visitsWrapper">
                                    {
                                        visits.map((visit, index)=><VisitCard {...visit}></VisitCard>)
                                    }
                                </div>
                            </div>
            }        
           
           
            <div className="applicationPageBtns">
                {
                    data?.status == 'Ожидание оплаты' &&  role == 'customer'? 
                    <GraceyButton onClick={()=>onPaymentClick()} size="large" type="primary">Оплатить заказ</GraceyButton> 
                    :''
                }
                {
                    data?.status != 'В архиве'  &&  role == 'customer' ?
                    <GraceyButton size="large" onClick={()=>moveToArchive()}>Отказаться от заказа</GraceyButton>:''

                }
                {/* <GraceyButton size="large" onClick={()=>navigate(-1)} >Закрыть окно</GraceyButton> */}
            </div>
        </div>
        </div>

    </div>
    </>
}