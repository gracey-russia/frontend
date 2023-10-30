import { ApplicationIE, OrderIE } from "../../types"
import './styles.css'
import {  App, Button, Tag } from 'antd';
import { axios } from "../../lib/axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";



export const OrderCard:React.FC<OrderIE> = (props) =>{
    const { message, modal, notification } = App.useApp();
    const navigate = useNavigate()
    let location = useLocation();
    return <div className='orderCard'>
            <div className="orderCardContent">
                <h2 className="orderH2">Заказ на сиделку</h2>    
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
            </div>

        </div>
}