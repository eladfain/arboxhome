
import styled from 'styled-components';
const BUTTON=styled.button`
color:${props=>props.textColor?props.textColor:"white"};
background:${props=>props.color}
`

const CallElevatorButton=props=>{
    const buttonHandler=(e)=>{
        props.callElevator(props.floor)
    }
    return<BUTTON textColor={props.status.status.textColor} color={props.status.status.color} onClick={buttonHandler}>{props.status.status.text}</BUTTON>
}

export default CallElevatorButton;