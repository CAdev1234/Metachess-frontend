import React from "react";

interface IProps {
    title: String;
    text: String;
    instruction: String;
}

const WarFrontToast = (props: IProps) => {

    const {title, text, instruction} = props;

    return (
        <div>
        
            <p> {title} </p> <br />

            <p> {text} </p>
                
            <p> {instruction} </p>  <br />
        
        </div>);

}

export default WarFrontToast;