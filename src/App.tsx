import { PatternSearch } from './components/PatternSearch';
import { passingZonePatterns } from './data/passingZonePatterns';

function App() {
  return (
      <PatternSearch patterns={passingZonePatterns} />
  );
}

export default App;
