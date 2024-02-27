import React, { useState } from "react";
import './styles.css'

export interface GraceySwitchIE{
    item1:{
        label:React.ReactNode, 
        children:React.ReactNode
    }
    item2:{
        label:React.ReactNode, 
        children:React.ReactNode
    }
    children?:React.ReactNode,
    onChange: (value:boolean)=>void,
    value: Boolean

}

export const GraceySwitch:React.FC<GraceySwitchIE> = (props) =>{
    const onChange = (value:boolean) =>{
        props.onChange(value)
    }

    return <div className="gracey-switch">
            <div className="switch-label-wrapper">
                <div onClick={()=>onChange(true)} className={"switch-label" + (props.value? ' active':"")}>
                    {props.item1.label}
                </div>
                <div onClick={()=>onChange(false)} className={"switch-label" + (props.value? '':" active")}>
                    {props.item2.label}
                </div>
            </div>
            {
                props.children
            }
            <div  className={"switch-content" + (props.value? '':" disable")}>
                {
                     props.item1.children
                }
            </div>
            <div className={"switch-content" + (props.value? ' disable':'')}>
                {
                    props.item2.children
                }
            </div>
            
    </div>
}