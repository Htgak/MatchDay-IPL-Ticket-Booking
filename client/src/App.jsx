import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Matches from './pages/Matches';
import MatchDetails from './pages/MatchDetails';
import SeatSelection from './pages/SeatSelection';
import Checkout from './pages/Checkout';
import MyTickets from './pages/MyTickets';
import TicketDetail from './pages/TicketDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminMatches from './pages/AdminMatches';
import Login from './pages/Login';
import Register from './pages/Register';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();
  const isCheckout = location.pathname.startsWith('/checkout') || location.pathname.startsWith('/ticket/');
  const isAuth = location.pathname === '/login' || location.pathname === '/register';
  const hideChrome = isCheckout || isAuth;

  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased selection:bg-secondary-container selection:text-on-background min-h-screen flex flex-col">
      {!hideChrome && <NavBar />}

        <main className="flex-grow pb-stack-xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/match/:id" element={<MatchDetails />} />
            <Route path="/match/:id/seats" element={<SeatSelection />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/tickets" element={<MyTickets />} />
            <Route path="/ticket/:id" element={<TicketDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/matches" element={<AdminMatches />} />
          </Routes>
        </main>
        
        {!hideChrome && <Footer />}
      </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
