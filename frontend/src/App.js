import logo from './logo.svg';
import './App.css';
import Homepage from './Homepage';
import WordDisplay from './list';
import { ContextProvider } from './ContextAPI/context';

function App() {
  return (
    <div className="App">
      <ContextProvider>
     <Homepage/>
     </ContextProvider>
     
    </div>
  );
}

export default App;

