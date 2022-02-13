
import './App.css';
import ElevatorGrid from './components/ElevatorsGrid';
import styled from 'styled-components';

const Wrapper=styled.div`
margin:auto;
width:30%;
text-align: center;
`

function App() {
  return (
    <Wrapper>
      <h1>Elevator Exercise</h1>
        <ElevatorGrid/>
    </Wrapper>
  );
}

export default App;
