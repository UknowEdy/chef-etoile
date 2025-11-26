import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Client pages
import Home from './pages/Home';
import Find from './pages/Find';
import ChefPage from './pages/ChefPage';
import ChefMenu from './pages/ChefMenu';
import Subscribe from './pages/Subscribe';
import MySubscriptions from './pages/MySubscriptions';
import MyOrders from './pages/MyOrders';
import Install from './pages/Install';

// Chef Admin pages
import ChefAdminLogin from './pages/chef-admin/Login';
import ChefAdminDashboard from './pages/chef-admin/Dashboard';
import ChefAdminMenu from './pages/chef-admin/Menu';
import ChefAdminMenuHistory from './pages/chef-admin/MenuHistory';
import ChefAdminSubscribers from './pages/chef-admin/Subscribers';
import ChefAdminOrders from './pages/chef-admin/Orders';
import ChefAdminDelivery from './pages/chef-admin/Delivery';

// Super Admin pages
import SuperAdminLogin from './pages/superadmin/Login';
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import SuperAdminChefs from './pages/superadmin/Chefs';
import SuperAdminNewChef from './pages/superadmin/NewChef';
import SuperAdminConfig from './pages/superadmin/Config';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Client routes */}
        <Route path="/" element={<Home />} />
        <Route path="/find" element={<Find />} />
        <Route path="/chef/:slug" element={<ChefPage />} />
        <Route path="/chef/:slug/menu" element={<ChefMenu />} />
        <Route path="/chef/:slug/subscribe" element={<Subscribe />} />
        <Route path="/my/subscriptions" element={<MySubscriptions />} />
        <Route path="/my/orders" element={<MyOrders />} />
        <Route path="/install" element={<Install />} />

        {/* Chef Admin routes */}
        <Route path="/chef-admin/login" element={<ChefAdminLogin />} />
        <Route path="/chef-admin/dashboard" element={<ChefAdminDashboard />} />
        <Route path="/chef-admin/menu" element={<ChefAdminMenu />} />
        <Route path="/chef-admin/menu/history" element={<ChefAdminMenuHistory />} />
        <Route path="/chef-admin/subscribers" element={<ChefAdminSubscribers />} />
        <Route path="/chef-admin/orders" element={<ChefAdminOrders />} />
        <Route path="/chef-admin/delivery" element={<ChefAdminDelivery />} />

        {/* Super Admin routes */}
        <Route path="/superadmin/login" element={<SuperAdminLogin />} />
        <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/superadmin/chefs" element={<SuperAdminChefs />} />
        <Route path="/superadmin/chefs/new" element={<SuperAdminNewChef />} />
        <Route path="/superadmin/config" element={<SuperAdminConfig />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
