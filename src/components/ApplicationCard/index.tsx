import { ApplicationIE } from "../../types"
import './styles.css'
import {  App, Button, Tag } from 'antd';
import { axios } from "../../lib/axios";
import { useNavigate } from "react-router-dom";



export const ApplicationCard:React.FC<ApplicationIE> = (props) =>{
    const { message, modal, notification } = App.useApp();
    const navigate = useNavigate()
    const deleteApplication = () =>{
        modal.confirm({
            title:'Вы точно хотите удалить Заявку?',
            content:'Обратно восстановить заявку далее будет нельзя',
            okText:'Да',
            cancelText: 'Отмена',
            onOk() {
                axios.delete('application/'+props.id + '/')
                window.location.reload()
            }
        })
    }

    return <div className='applicationCard'>
            <div className="applicationCardContent">
                <h2 className="appH2">Заявка на сиделку</h2>    
                <div>{props.care_type}</div>
                <div>Способ связи: {props.contact_type}</div>
                <Tag color="#87d068">Новая</Tag>
            </div>
            
            <div className="applicationCardBtns">
                <Button type='primary' onClick={()=>navigate('application/'+props.id)}>Подробнее</Button>
                <Button onClick={()=>deleteApplication()}>Отменить</Button>
            </div>

        </div>
}