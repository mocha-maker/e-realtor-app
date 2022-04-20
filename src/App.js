// Utilities
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

// Components
import Navbar from './components/Navbar'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Explore from './pages/Explore'
import Category from "./pages/Category";
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Explore/>} />
        <Route path='/offers' element={<Offers/>} />
        <Route path='/category/:categoryName' element={<Category/>} />
        <Route path='/profile' element={<PrivateRoute/>}>
        <Route path='/profile' element={<Profile/>} />
          </Route>
        <Route path='/create-listing' element={<CreateListing/>} />
        <Route path='/category/:categoryName/:listingId' element={<Listing/>} />
        <Route path='/contact/:landlordId' element={<Contact/>} />

        <Route path='/sign-in' element={<SignIn/>} />
        <Route path='/sign-up' element={<SignUp/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
      </Routes>
      <Navbar/>
    </Router>
    <ToastContainer 
      position="bottom-center"
      pauseOnHover={false}
      newestOnTop={false}/>
    </>
  );
}

export default App;
