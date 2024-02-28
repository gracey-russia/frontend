import './styles.css'
import React, { useContext } from 'react'
import { VisitIE } from '../../types'
import {App,Tag, Space, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { RoleContext } from '../../pages/DefaultPage'
import { LineComponent } from '../LineComponent'
import { GraceyButton } from '../GraceyButton'
import { axios } from '../../lib/axios'

const { TextArea } = Input;

export const VisitCard:React.FC<VisitIE> = (props) =>{
    let navigate = useNavigate()
    const { message, notification, modal } = App.useApp();

    let role = useContext(RoleContext)
    
    let create_date = new Date((props.create_date as any) * 1000)
    let completed_date = new Date((props.completed_date as any) * 1000)
    let start_visit_date = new Date(Date.parse(props.date as string))
    let now_date = new Date()

    const onCompleteClick = () =>{
        let l_comment = props.nursecomment

        modal.confirm({
            title:'Вы точно хотите подтвердить выполнение посещения?',
            content:<div>
                <Space>
                    <h4 style={{margin:'0px'}}>Комментарий:</h4>
                    <TextArea defaultValue={l_comment}  onChange={(e)=> l_comment = e.target.value as string} rows={3}/>
                </Space>
            </div>,
            okText:'Да',
            cancelText: 'Отмена',
            onOk() {
                axios.put('visit/'+props.id + '/',{
                    id:props.id,
                    nursecomment: l_comment,
                    completed: true,
                    date: props.date,
                    order: props.order,
                    time_start: props.time_start,
                    time_end: props.time_end,
                }).then((r)=>{
                    navigate('/nurse')
                    window.location.reload()
                    message.success('Посещение выполнено!')
                })             
            }
        })
    }
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
                {
                        (props.completed == false && role == 'nurse' && now_date > start_visit_date)? <GraceyButton onClick={()=>onCompleteClick()}>Отметить выполненным</GraceyButton> : ''
                }

            </div>

        </div>
}