import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Calendar from "./components/calendar/calendar";
import Navbar from "./components/navbar";
import Login from "./components/profile/login";
import Profile from "./components/profile/profile";
import Register from "./components/profile/register";
import TodoList from './components/todos/TodoList';
import Footer from "./components/footer";
import PrivacyPolicy from "./components/legal/privacy";
import TermsOfService from "./components/legal/termsofservice";
import WebsiteDisclaimer from "./components/legal/webdisclaimer";
import TodosHistory from './components/todosHistory/todosHistory';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/privacy" element={<PrivacyPolicy />} /> 
        <Route path="/termsofservice" element={<TermsOfService />} /> 
        <Route path="/webdisclaimer" element={<WebsiteDisclaimer />} /> 
        <Route path="/todosHistory" element={<TodosHistory />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
