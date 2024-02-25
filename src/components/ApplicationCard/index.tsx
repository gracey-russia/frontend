import { ApplicationIE } from "../../types"
import './styles.css'
import {  App, Button, Tag } from 'antd';
import { axios } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { GraceyButton } from "../GraceyButton";



export const ApplicationCard:React.FC<ApplicationIE> = (props) =>{
    // const { message, modal, notification } = App.useApp();
    const navigate = useNavigate()
    // const deleteApplication = () =>{
    //     modal.confirm({
    //         title:'Вы точно хотите удалить Заявку?',
    //         content:'Обратно восстановить заявку далее будет нельзя',
    //         okText:'Да',
    //         cancelText: 'Отмена',
    //         onOk() {
    //             axios.delete('application/'+props.id + '/')
    //             window.location.reload()
    //         }
    //     })
    // }


    return <div className='applicationCard'>
            <div className='applicationCardWrapper'>
                <div className="applicationCardContent">
                    <Tag color="#2DC071">Новая</Tag>
                    <h2 className="appH2">Заявка на подбор специалиста</h2>    
                    <div className="appText">{props.care_type}</div>
                    <div className="connectText">Способ связи:  {
                        props.contact_type == 'WhatsApp'? 
                            <img src='/whatsapp.svg' /> :
                            props.contact_type == 'Telegram' ? 
                            <img src='/telegram.svg'/>:
                            <img src='/tel.svg'/>
                        } {props.contact_type == 'Позвоните мне'? 'Звонок': props.contact_type}
                    </div>
                </div>
                
                <div className="applicationCardBtns">
                    <div className="nurseFaceWrapper">
                        <img className="nurseFace" src='/nurse_face.png'></img>
                        <div className="textBlueApp">Подбираем специалиста</div>
                    </div>
                    {/* <Button onClick={()=>deleteApplication()}>Отменить</Button> */}
                </div>
            </div>
           
        <GraceyButton size="large" type='primary' onClick={()=>navigate('application/'+props.id)}>Подробнее</GraceyButton>

        </div>
}