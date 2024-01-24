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
                <h2 className="appH2">Заявка на подбор специалиста</h2>    
                <Tag color="#87d068">Новая</Tag>
                <div>{props.care_type}</div>
                <div>Способ связи: {props.contact_type}</div>
                <Button type='primary' onClick={()=>navigate('application/'+props.id)}>Подробнее</Button>
            </div>
            
            <div className="applicationCardBtns">
                <div className="nurseFaceWrapper">
                    <img className="nurseFace" src='/nurse_face.png'></img>
                    <div style={{color:"#A9A9A9"}}>Подбор специалиста</div>
                </div>
                {/* <Button onClick={()=>deleteApplication()}>Отменить</Button> */}
            </div>

        </div>
}