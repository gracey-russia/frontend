import './styles.css'
import React, { useContext } from 'react'
import { VisitIE } from '../../types'
import { Button, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { RoleContext } from '../../pages/DefaultPage'
import { LineComponent } from '../LineComponent'
import { GraceyButton } from '../GraceyButton'

export const VisitCard:React.FC<VisitIE> = (props) =>{
    let navigate = useNavigate()

    let role = useContext(RoleContext)
    

    return  <div className='visitCard'>
                <div className="visitCardContent">
                    <div className='visit-card-header'>
                        <div className="orderH2">Посещение</div>  
                        {
                            <Tag color={ props.completed? '#2C4192':'#f50'}>{props.completed? 'Выполнено':'Ожидает выполнения'}</Tag>
                        }   
                    </div>
                    
                    <LineComponent title='Дата'>{new Date(Date.parse(props.date as string)).toLocaleDateString()}</LineComponent>
                    <LineComponent title='Время'>{props.time_start} - {props.time_end}</LineComponent>
                
                </div>
            
            <div className="visitCardBtns">
                <GraceyButton type='primary' onClick={()=>navigate( '/'+ role + '/visit/'+props.id)}>Подробнее</GraceyButton>
                {
                    (props.completed && role == 'customer' && (props.order_in_archive != true))? 

                    props.appelations.length > 0? 
                    <GraceyButton onClick={()=>navigate('/customer/appelation/'+props.appelations[props.appelations.length-1])}>Посмотреть аппеляцию</GraceyButton>
                    :
                    <GraceyButton onClick={()=>navigate('/customer/appelation/create/'+props.id)}>Создать аппеляцию</GraceyButton>
                    :
                    ''
                }

            </div>

        </div>
}