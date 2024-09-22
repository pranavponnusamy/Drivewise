import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainNavigator } from "./MainNavigator";
import { PrivacyPolicy } from "./PrivacyPolicy/PrivacyPolicy.page";
import { Terms } from "./Terms/Terms";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/*" element={<MainNavigator />} />
      </Routes>
    </Router>
  );
}

export default App;
