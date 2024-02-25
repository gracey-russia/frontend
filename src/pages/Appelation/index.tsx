import { App, Button, Input, Space, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GraceyButton } from '../../components/GraceyButton'
import { LineComponent } from '../../components/LineComponent'
import { axios } from '../../lib/axios'
import { AppelationIE, VisitIE } from '../../types'
import './styles.css'

const { TextArea } = Input;


export const AppelationPage:React.FC = () => {
    const {appelation_id} = useParams()
    const [appelation, setAppelation] = useState<AppelationIE>()
    const { message, notification, modal } = App.useApp();

    useEffect(()=>{
        axios.get('appelation/'+appelation_id+'/').then((r)=>{
            if (r.status == 200){
                console.log(r.data)
                setAppelation(r.data)
            }
        }).catch((r_)=>{
            if (r_.response.status != 200){
                message.error('Ошибка сервера!')
            }
            }
        )
    },[setAppelation])
   
    

    let navigate = useNavigate()
    return <div className="appelation-page-background">
                <div className="appelation-page">
                    <div className='appelation-page-header'>
                        Аппеляция
                        <img onClick={()=>navigate(-1)} style={{cursor:'pointer'}} src='/cross.svg' />
                    </div>
                    
                    <Tag color={
                                appelation?.status == 'На рассмотрени'? 
                                '#f50':  appelation?.status == 'Новая'? 
                                '#87d068':"#2db7f5"
                            }>{ appelation?.status}
                    </Tag>
                    <LineComponent title='ID Аппеляции'>{appelation_id}</LineComponent>
                    <LineComponent title='ID Визита'>{appelation?.visit}</LineComponent>

                    <LineComponent title='Ваше сообщение'>
                        {appelation?.comment}
                    </LineComponent>
                   
                    {
                       (appelation?.status == 'Новая' || appelation?.status == 'На рассмотрении')? "":
                       <>
                        <LineComponent title='Ответ менеджера'>
                            {appelation?.ans}
                        </LineComponent>
                       </>
                    }
                    <div className="appelation-page-btns">
                        <GraceyButton onClick={()=>navigate(-1)}>Закрыть окно</GraceyButton>
                    </div>
                </div>
            </div>
}