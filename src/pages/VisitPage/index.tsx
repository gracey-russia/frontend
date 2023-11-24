import { App, Button, Input, Space, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axios } from '../../lib/axios'
import { VisitIE } from '../../types'
import './styles.css'

const { TextArea } = Input;


export const VisitPage:React.FC = () => {
    const {visit_id} = useParams()
    const [visit, setVisit] = useState<VisitIE>()
    const { message, notification, modal } = App.useApp();

    let create_date = new Date((visit?.create_date as any) * 1000).toLocaleString()
    let completed_date = new Date((visit?.completed_date as any) * 1000).toLocaleString()
    const role  = location.pathname.split('/')[1]

    useEffect(()=>{
        axios.get('visit/'+visit_id + '/').then((r)=>{
            setVisit(r.data)
        })
    }, [setVisit])


   
    const onCompleteClick = () =>{
        let l_comment = visit?.nursecomment

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
                axios.put('visit/'+visit_id + '/',{
                    id:visit?.id,
                    nursecomment: l_comment,
                    completed: true,
                    date: visit?.date,
                    order: visit?.order,
                    time_start: visit?.time_start,
                    time_end: visit?.time_end,
                }).then((r)=>{
                    navigate('/nurse')
                    window.location.reload()
                    message.success('Посещение выполнено!')
                })             
            }
        })
    }

    let navigate = useNavigate()
    return <div className="applicationPageBackground">
                <div className="applicationPage">
                    <h2>Посещение</h2>
                    <Space><h4 style={{margin:'0px'}}>ID:</h4> {visit?.id}</Space>
                    <Tag color={ visit?.completed? '#87d068':'#f50'}>{visit?.completed? 'Выполнено':'Ожидает выполнения'}</Tag>
                    <Space direction='vertical'>
                            <Space><h4 style={{margin:'0px'}}>Дата посещения:</h4> {visit?.date}</Space>
                            <Space><h4 style={{margin:'0px'}}>Время посещения:</h4> {visit?.time_start}-{visit?.time_end}</Space>
                            <Space><h4 style={{margin:'0px'}}>Cоздано в системе:</h4>{create_date}</Space>
                            {
                                visit?.completed? <Space><h4 style={{margin:'0px'}}>Заверешено:</h4>{completed_date}</Space> : ''

                            }
                            {
                                (visit?.nursecomment == undefined || visit?.nursecomment.length < 1)? 
                                ''
                                :
                                <Space><h4 style={{margin:'0px'}}>Комментарий исполнителя:</h4>{visit.nursecomment}</Space>
                            }
                    </Space>
                    <Button onClick={()=>navigate('/nurse/order/' + visit?.order)}>Перейти к заказу </Button>
                    {
                        visit?.completed? '': role == 'nurse'? '':<Button onClick={()=>onCompleteClick()} type='primary'>Отметить выполненным</Button>
                    }
                    <div className="applicationPageBtns">
                        <Button onClick={()=>navigate(-1)} type='primary'>Закрыть окно</Button>
                    </div>
                </div>
            </div>
}