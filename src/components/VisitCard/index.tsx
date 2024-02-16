import './styles.css'
import React, { useContext } from 'react'
import { VisitIE } from '../../types'
import { Button, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { RoleContext } from '../../pages/DefaultPage'

export const VisitCard:React.FC<VisitIE> = (props) =>{
    let navigate = useNavigate()

    let role = useContext(RoleContext)
    

    return  <div className='visitCard'>
            <div className="visitCardContent">
                <h2 className="orderH2">Посещение</h2>    
                <div>Дата: {new Date(Date.parse(props.date as string)).toLocaleDateString()}</div>
                <div>Время: {props.time_start} - {props.time_end}</div>
                {
                    <Tag color={ props.completed? '#87d068':'#f50'}>{props.completed? 'Выполнено':'Ожидает выполнения'}</Tag>
                }   
            </div>
            
            <div className="visitCardBtns">
                <Button type='primary' onClick={()=>navigate( '/'+ role + '/visit/'+props.id)}>Подробнее</Button>

                {
                    (props.completed && role == 'customer' && (props.order_in_archive != true))? 

                    props.appelations.length > 0? 
                    <Button onClick={()=>navigate('/customer/appelation/'+props.appelations[props.appelations.length-1])}>Посмотреть аппеляцию</Button>
                    :
                    <Button onClick={()=>navigate('/customer/appelation/create/'+props.id)}>Создать аппеляцию</Button>
                    :
                    ''
                }

            </div>

        </div>
}