import { App, Button, Input, Space, Tag } from 'antd'
import { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { axios } from '../../lib/axios'
import { VisitIE } from '../../types'
import './styles.css'
import { RoleContext } from '../../pages/DefaultPage'
import { GraceyButton } from '../../components/GraceyButton'
import { LineComponent } from '../../components/LineComponent'

const { TextArea } = Input;

export const VisitPage:React.FC = () => {
    const {visit_id} = useParams()
    const [visit, setVisit] = useState<VisitIE>()
    const { message, notification, modal } = App.useApp();
    let create_date = new Date((visit?.create_date as any) * 1000)
    let completed_date = new Date((visit?.completed_date as any) * 1000)
    let start_visit_date = new Date(Date.parse(visit?.date as string))
    let now_date = new Date()
    let role = useContext(RoleContext)

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
    return <div className="visit-page-background">
                <div className="visit-page">
                    <div className='visit-page-header'>
                        Посещение
                        <img onClick={()=>navigate(-1)} src='/cross.svg'/>
                    </div>
                    {/* <Space><h4 style={{margin:'0px'}}>ID:</h4> {visit?.id}</Space> */}
                    <Tag color={ visit?.completed? '#2C4192':'#f50'}>{visit?.completed? 'Выполнено':'Ожидает выполнения'}</Tag>
                    <LineComponent title='Дата посещения'>{start_visit_date.toLocaleDateString()}</LineComponent>
                    <LineComponent title='Время посещения'>{visit?.time_start}-{visit?.time_end}</LineComponent>
                    <LineComponent title='Создано в системе'>{create_date.toLocaleString()}</LineComponent>

                    {
                        visit?.completed? <LineComponent title='Завершено'>{completed_date.toLocaleString()}</LineComponent>  : ''

                    }
                    {
                        (visit?.nursecomment == undefined || visit?.nursecomment.length < 1)? 
                        ''
                        :
                        <LineComponent title='Kомментарий исполнителя'>{visit.nursecomment}</LineComponent>
                    }
                    <GraceyButton size='normal' onClick={()=>navigate('/' + role + '/order/' + visit?.order)}>Перейти к заказу </GraceyButton>
                    {
                        (visit?.completed == false && role == 'nurse' && now_date > start_visit_date)? <GraceyButton onClick={()=>onCompleteClick()} type='primary'>Отметить выполненным</GraceyButton> : ''
                    }
                    {/* <div className="applicationPageBtns">
                        <Button onClick={()=>navigate(-1)} type='primary'>Закрыть окно</Button>
                    </div> */}
                </div>
            </div>
}