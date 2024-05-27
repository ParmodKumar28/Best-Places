import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import PrivateRoute from './components/Auth/PrivateRoute';
import AddShopForm from './components/Shops/AddShopForm';
import HomePage from './pages/Home';
import Header from './components/Layout/Header';
import ShopListPage from './pages/ShopList';
import AdminProfilePage from './pages/AdminProfilePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UpdateShop from './components/Shops/UpdateShop';
import ShopDetailsPage from './pages/ShopDetails';


const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path='/shops' element={<ShopListPage />} />
          <Route path="/add-shop" element={<AddShopForm />} />
          <Route path="/profile" element={<AdminProfilePage />} />
          <Route path="/shops/update/:shopId" element={<UpdateShop />} />
          <Route path='/shop/:id' element={<ShopDetailsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
