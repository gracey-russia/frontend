import './styles.css'
import React from 'react'
import { VisitIE } from '../../types'
import { Button, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'

export const VisitCard:React.FC<VisitIE> = (props) =>{
    let navigate = useNavigate()

    return  <div className='visitCard'>
            <div className="visitCardContent">
                <h2 className="orderH2">Посещение</h2>    
                <div>Дата: {props.date}</div>
                <div>Время: {props.time_start} - {props.time_end}</div>
                {
                    <Tag color={ props.completed? '#87d068':'#f50'}>{props.completed? 'Выполнено':'Ожидает выполнения'}</Tag>
                }   
            </div>
            
            <div className="visitCardBtns">
                <Button type='primary' onClick={()=>navigate('/nurse/visit/'+props.id)}>Подробнее</Button>
            </div>

        </div>
}