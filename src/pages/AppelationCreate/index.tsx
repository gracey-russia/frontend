import { App, Button, Input, Space, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axios } from '../../lib/axios'
import { VisitIE } from '../../types'
import './styles.css'

const { TextArea } = Input;


export const AppelationCreatePage:React.FC = () => {
    const {visit_id} = useParams()
    const [visit, setVisit] = useState<VisitIE>()
    const { message, notification, modal } = App.useApp();
    const [text, setText] = useState('')
    let create_date = new Date((visit?.create_date as any) * 1000).toLocaleString()
    let completed_date = new Date((visit?.completed_date as any) * 1000).toLocaleString()
    
    useEffect(()=>{
        axios.get('visit/'+visit_id + '/').then((r)=>{
            setVisit(r.data)
        })
    }, [setVisit])


   
    const onCreate = () =>{
        axios.post('appelation/', {
            visit: visit?.id,
            comment:text
        }).then((r)=>{
            if (r.status == 201){
                navigate(-1)
                message.success('Аппеляция создана! Ожидайте.')
            }
        }).catch((r_)=>{
            if (r_.response.status != 201){
                message.error('Ошибка сервера!')
            }
            }
        )
    }

    let navigate = useNavigate()
    return <div className="applicationPageBackground">
                <div className="applicationPage">
                    <h2>Создание аппеляции</h2>
                    <Space><h4 style={{margin:'0px'}}>ID Посещения:</h4> {visit?.id}</Space>
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
                    <h3>Ваша аппеляция</h3>
                    <TextArea placeholder='Введите текст аппеляции посещения' value={text} onChange={(e)=>setText(e.target.value)}>

                    </TextArea>
                   
                    <div className="applicationPageBtns">
                        <Button onClick={()=>onCreate()}>Создать аппеляцию</Button>
                        <Button onClick={()=>navigate(-1)} type='primary'>Отмена</Button>
                    </div>
                </div>
            </div>
}