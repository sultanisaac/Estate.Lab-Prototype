import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Booking } from './pages/Booking';
import { Legal } from './pages/Legal';
import { PropertyDetails } from './pages/PropertyDetails';
import { Properties } from './pages/Properties';
import { PageTransition } from './components/layout/PageTransition';
import { AdminLayout } from './pages/admin/AdminLayout';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/property/:id" element={<PageTransition><PropertyDetails /></PageTransition>} />
        <Route path="/properties" element={<PageTransition><Properties /></PageTransition>} />
        <Route path="/booking" element={<PageTransition><Booking /></PageTransition>} />
        <Route path="/legal" element={<PageTransition><Legal /></PageTransition>} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) {
    return <AnimatedRoutes />;
  }

  return (
    <div className="min-h-screen font-sans selection:bg-brand-secondary/30 selection:text-brand-primary flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
