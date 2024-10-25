// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CallbackPage from "./pages/CallbackPage";
import HomePage from './pages/HomePage';  // Assuming HomePage is in pages directory


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="api/auth/callback/google" element={<CallbackPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;