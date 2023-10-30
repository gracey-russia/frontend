import { App, Button, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
                navigate(-1)
                window.location.reload()
            }
        })
    }
    return <div className="applicationPageBackground">
        <div className="applicationPage">
            <h2>Новая заявка</h2>
            <div>ID заявки: {data?.id}</div>
            <div>Вид ухода: {data?.care_type}</div>
            <div>Когда начать: {data?.time_start}</div>
            <div>Способ связи: {data?.contact_type}</div>
            <Tag color="#87d068">Новая</Tag>
            <div className="applicationPageBtns">
                <Button onClick={()=>deleteApplication()}>Отменить заявку</Button>
                <Button onClick={()=>navigate(-1)} type='primary'>Закрыть окно</Button>
            </div>
        </div>
    </div>
}