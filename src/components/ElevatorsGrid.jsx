import React, { useEffect,useState,useReducer } from "react";
import {FLOORS,ELEVATORS} from '../util/constants';
import styled,{ keyframes } from 'styled-components';
import CallElevatorButton from "./CallElevatorButton";
import Elevator from "./Elevator";
const TD=styled.td`
    width:100px;
    height:50px;
    border: 1px solid black;
`

const elevatorAnimation=(position)=>keyframes`
0%{top:${position}%}
100%{top:0%}
`
const ElevatorWrapper=styled.span`
position:relative;
animation-name ${props=>props.position!==0?elevatorAnimation(props.position*100):null};
 animation-duration: ${props=>`${Math.abs(props.position)}s`};`
const callElevatorButtonInitialState=()=>{
    const buttons=[];
    for(let i=0;i<FLOORS;i++){
        buttons.push({status:statusDictionary('call')})
    }
    return buttons;
}
const statusDictionary=status=>{
    switch(status){
        
        case 'waiting':
            return{
                text:"waiting",
                color:'red'
            }
        case 'arrived':
            return{
                text:'arrived',
                color:"white",
                textColor:'green'
            }
            case "call":
            default:
                return{
                    text:'call',
                    color:'green'
                }
    }
}
const elevatorButtonsReducer=(state,action)=>{
    if(action.type==='STATUS_CHANGE'){
        const newState=[...state];
        newState[action.payload.index].status={...action.payload.status};
        return newState;
    }
    return state;
}
 const elevatorsInitialState=()=>{
     const elevatorsArr=[];
     for(let i=0;i<ELEVATORS;i++){
        elevatorsArr.push({pier:i,position:0,margin:0,isReady:true})
     }
     return elevatorsArr;
 }
const reducerElevator=(state,action)=>{
    if(action.type==="MOVE"){
        const newElevatorArr=[...state];
        const elevatorToMove=newElevatorArr.find(e=>e.pier===action.payload.pier)
        elevatorToMove.position=action.payload.position;
        elevatorToMove.margin=action.payload.margin;
        return newElevatorArr;
    }
    if(action.type==="SET_READY"){
        const newElevatorArr=[...state];
        const elevator=newElevatorArr.find(e=>e.pier===action.payload.pier);
        elevator.isReady=action.payload.isReady;
        return newElevatorArr;
    }
    return state;
}
const makeSound=()=>{
    const context = new AudioContext();
    const o = context.createOscillator();
    o.type = "square";
    o.connect(context.destination);
    o.start();
    setTimeout(() => {
        o.stop();
    }, 750);
}
const ElevatorGrid=()=>{
    const [elevators,dispatchElevators]=useReducer(reducerElevator,elevatorsInitialState());
    const [callButtonsStatus,dispatchCallButtonsStatus]=useReducer(elevatorButtonsReducer,callElevatorButtonInitialState())
    const elevatorCallQueue=[];
    const animationEnd=floor=>{
        makeSound();
        dispatchCallButtonsStatus({type:'STATUS_CHANGE',payload:{index:floor,status:statusDictionary('arrived')}})
        setTimeout(() => {
            dispatchCallButtonsStatus({type:'STATUS_CHANGE',payload:{index:floor,status:statusDictionary('call')}})
            dispatchElevators({type:"SET_READY",payload:{pier:elevators.find(e=>e.position===floor).pier ||0,isReady:true}})
        }, 2000);
        if(elevatorCallQueue.length){
            console.log("in queue")
            const next=elevatorCallQueue.shift();
            callElevator(next);
        }
    }
    const callElevator=(toFloor)=>{ 
        const filterdElevators=elevators.filter(elevator=>elevator.isReady);
        if(filterdElevators.length>0){
            const closestElevator=filterdElevators.reduce((closest,next)=>{
                if(Math.abs(toFloor-next.position)<Math.abs(toFloor-closest.position)){
                    closest=next;
                }
                return closest;
            },filterdElevators[0])
            const margin=(toFloor-closestElevator.position)
            dispatchElevators({type:"MOVE",payload:{position:(toFloor),pier:closestElevator.pier,margin:margin}})
            dispatchElevators({type:"SET_READY",payload:{pier:closestElevator.pier,isReady:false}})
            dispatchCallButtonsStatus({type:'STATUS_CHANGE',payload:{index:toFloor,status:statusDictionary('waiting')}});
        }
        else{
            console.log("in else")
            elevatorCallQueue.push(toFloor);
        }
        
       
    }   
        const elevatorsTable=[];
        for(let i=0;i<FLOORS;i++){
            const cells=[];
            for(let j=0;j<(ELEVATORS+2);j++){
                if(j===0){
                    cells.push(<td key={"name"+i}>{FLOORS-(i+1)} floor</td>)
                }
                else if(j===(ELEVATORS+1)){
                    cells.push(<td key={`button${i}`}><CallElevatorButton status={callButtonsStatus[FLOORS-(i+1)]} callElevator={callElevator}  floor={FLOORS-(i+1)}/></td>)
                }else{
                    if(elevators[j-1].position===(FLOORS-(i+1))){
                        cells.push(<TD key={`${i}${j}`}><ElevatorWrapper onAnimationEnd={()=>{animationEnd(elevators[j-1].position)}} position={elevators[j-1].margin}><Elevator/></ElevatorWrapper></TD>)
                    }else{
                        cells.push(<TD key={`${i}${j}`}></TD>)
                    }
                   
                }
            }
            elevatorsTable.push(<tr key={"row"+i}>{cells}</tr>)
        }
        
 
   
  
    return(
        <table>
            <tbody>
            {elevatorsTable}
            </tbody>
         
        </table>
    )
}

export default ElevatorGrid;