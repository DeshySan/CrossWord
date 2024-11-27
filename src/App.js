import logo from "./logo.svg";
import "./App.css";
import Crossword from "./Crossword";
import WordSearchCrossword from "./WordSearchCrossword";

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Welcome to CrossWord</h1>
      </header>
      <main>
        <Crossword />
      </main>
    </div>
  );
}

export default App;
