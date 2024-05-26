import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import PrivateRoute from './components/Auth/PrivateRoute';
import AddShopForm from './components/Shops/AddShopForm';
import HomePage from './pages/Home';
import Header from './components/Layout/Header';
import ShopListPage from './pages/ShopList';


const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path='/shops' element={<ShopListPage />} />
          <Route path="/add-shop" element={<AddShopForm />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
