import { PatternSearch } from './components/PatternSearch';
import { passingZonePatterns } from './data/passingZonePatterns';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PatternSearch patterns={passingZonePatterns} />
    </div>
  );
}

export default App;
