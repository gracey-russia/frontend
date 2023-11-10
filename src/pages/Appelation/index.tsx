import { App, Button, Input, Space, Tag } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
    return <div className="applicationPageBackground">
                <div className="applicationPage">
                    <h2>Аппеляция</h2>
                    <Space><h4 style={{margin:'0px'}}>Cтатус аппеляции:</h4>
                     <Tag color={
                        appelation?.status == 'На рассмотрени'? 
                        '#f50':  appelation?.status == 'Новая'? 
                        '#87d068':"#2db7f5"
                    }>{ appelation?.status}</Tag>
                        
                    </Space>

                    <Space><h4 style={{margin:'0px'}}>ID аппеляции:</h4> {appelation_id}</Space>
                    <Space><h4 style={{margin:'0px'}}>ID визита:</h4> {appelation?.visit}</Space>
                    


                    <h3>Ваше сообщение</h3>
                    {
                        appelation?.comment
                    }
                    {
                       (appelation?.status == 'Новая' || appelation?.status == 'На рассмотрении')? "":
                       <>
                       <h3>Ответ менеджера</h3>
                       {
                        appelation?.ans
                       }
                       </>
                    }
                    <div className="applicationPageBtns">
                        <Button onClick={()=>navigate(-1)} type='primary'>Закрыть окно</Button>
                    </div>
                </div>
            </div>
}