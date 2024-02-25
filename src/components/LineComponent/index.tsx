import React from "react";
import './styles.css'

export interface LineComponentIE{
    title:string,
    children?: React.ReactNode
}

export const LineComponent: React.FC<LineComponentIE> = (props) =>{
    return <div className="line-component">
        <div className="line-component-title">{props.title}</div>
        <div className="line-component-text">{props.children}</div>
        <div className='line-component-line'></div>
    </div>
}