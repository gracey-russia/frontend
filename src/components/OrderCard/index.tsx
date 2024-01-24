import { ApplicationIE, CustomerInfoIE, OrderIE } from "../../types"
import './styles.css'
import {  App, Button, Tag } from 'antd';
import { axios, userApi } from "../../lib/axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";



export const OrderCard:React.FC<OrderIE> = (props) =>{
    const { message, modal, notification } = App.useApp();
    const navigate = useNavigate()
    let location = useLocation();
    const [customer, setCustomer] = useState<CustomerInfoIE>()

    useEffect(()=>{
            userApi.get('customer_info/'+props.client+'/').then((r)=>{
            setCustomer(r.data)
            }).catch((r)=>{
                if (r.status!= 200){
                    message.error('Ошибка сервера!')
                }
            }
     )}, [setCustomer])

    const paymentClick = () =>{
        let cost = 0
 
         axios.get('order/accept/' + props.id + '/').then((r)=>{
             if (r.status == 200){
                 var widget = new (window as any).cp.CloudPayments();
 
 
                 widget.pay('auth', 
                 { 
                     publicId: 'pk_a2d44a7570fe7490cfe41bb85f660', 
                     description: 'Оплата заказа id:' + props.id,
                     amount: r.data.cost, 
                     currency: 'RUB', 
                     accountId: props.client, 
                     invoiceId: props.id, 
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
                         address: props.address,
                         city: customer?.customer_info.region,
                         country: 'RU',
                         phone: props.client,
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



    return <div className='orderCard'>
            <div className="orderCardContent">
                <h2 className="orderH2">Заказ</h2>  
                <div>Тип: {props.care_type}</div>
                <div>Адрес: {props.address}</div>
                <div>Cиделка: {props.nurse}</div>
                <div>Cтоимость: {props.cost}</div>
                {
                    location.pathname.split('/')[location.pathname.split('/').length-1] == 'nurse'?
                    <Tag color={ props.status == 'В архиве'? "#2db7f5" : '#87d068' }>{ props.status == 'В архиве'? "В архиве" : 'Активный'}</Tag>
                    :
                    <Tag color={
                        props.status == 'Ожидание оплаты'? 
                        '#f50': props.status == 'Активный'? 
                        '#87d068':"#2db7f5"
                    }>{props.status}</Tag>
                }
                
            </div>
            
            <div className="orderCardBtns">
                <Button type='primary' onClick={()=>navigate('order/'+props.id)}>Подробнее</Button>
                {
                    props.status == 'Ожидание оплаты'? <Button  onClick={()=>paymentClick()}>Оплатить</Button>
                    : 
                    <></>
                }

            </div>

        </div>
}