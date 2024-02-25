import React, { useState } from "react";
import './styles.css'

export interface GraceySwitchIE{
    defaultActive?:boolean
    item1:{
        label:React.ReactNode, 
        children:React.ReactNode
    }
    item2:{
        label:React.ReactNode, 
        children:React.ReactNode
    }
    children?:React.ReactNode
}

export const GraceySwitch:React.FC<GraceySwitchIE> = (props) =>{
    const [firstItem, setFirstItem] = useState(props.defaultActive == undefined?  true:props.defaultActive)


    return <div className="gracey-switch">
            <div className="switch-label-wrapper">
                <div onClick={()=>setFirstItem(true)} className={"switch-label" + (firstItem? ' active':"")}>
                    {props.item1.label}
                </div>
                <div onClick={()=>setFirstItem(false)} className={"switch-label" + (firstItem? '':" active")}>
                    {props.item2.label}
                </div>
            </div>
            {
                props.children
            }
            <div  className={"switch-content" + (firstItem? '':" disable")}>
                {
                     props.item1.children
                }
            </div>
            <div className={"switch-content" + (firstItem? ' disable':'')}>
                {
                    props.item2.children
                }
            </div>
            
    </div>
}