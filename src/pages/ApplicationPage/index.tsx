import { App, Button, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GraceyButton } from "../../components/GraceyButton";
import { LineComponent } from "../../components/LineComponent";
import { axios } from "../../lib/axios";
import { ApplicationIE } from "../../types";
import './styles.css'

export const ApplicationPage:React.FC = () =>{
    let {application_id} = useParams()
    const [data, setData] = useState<ApplicationIE>()
    const { message, notification, modal } = App.useApp();

    const navigate = useNavigate()
    useEffect( () =>{
        axios.get('application/'+application_id+'/').then((r)=>{
           setData(r.data)
        }).catch((r)=>{
            if (r.status != 200){
                message.error('Ошибка сервера!')
            }
        }
        )
    }, [setData])


    const deleteApplication = () =>{
        modal.confirm({
            title:'Вы точно хотите удалить Заявку?',
            content:'Обратно восстановить заявку далее будет нельзя',
            okText:'Да',
            cancelText: 'Отмена',
            onOk() {
                axios.delete('application/'+data?.id + '/')
                navigate('/customer')
                window.location.reload()
            }
        })
    }
    return <div className="application-page-background">
        <div className="application-page">
            <div className="application-page-wrapper">
                <h2 className="application-page-h2">Заявка на подбор специалиста</h2>
                <img onClick={()=>navigate(-1)} className="application-page-cross" src='/cross.svg'/>
            </div>
            <Tag color="#2DC071">Новая</Tag>

            <LineComponent title="ID заявки">{data?.id}</LineComponent>
            <LineComponent title="Вид ухода">{data?.care_type}</LineComponent>
            <LineComponent title="Когда начать">{data?.time_start}</LineComponent>
            <LineComponent title="Способ связи">{data?.contact_type}</LineComponent>
            <div className="application-page-btns">
                <GraceyButton size="large" onClick={()=>deleteApplication()}>Отменить заявку</GraceyButton>
                {/* <Button onClick={()=>navigate(-1)} type='primary'>Закрыть окно</Button> */}
            </div>
        </div>
    </div>
}