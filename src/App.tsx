import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './components/RootLayout';
// Client pages
import Home from './pages/Home';
import ChefMenu from './pages/ChefMenu';
import Subscribe from './pages/Subscribe';
import MySubscriptions from './pages/MySubscriptions';
import MyPickupPoint from './pages/MyPickupPoint';
import DiscoverChefs from './pages/DiscoverChefs';
import ChefProfile from './pages/ChefProfile';
import MyOrders from './pages/MyOrders';
import Install from './pages/Install';
import Support from './pages/Support';
import MyProfile from './pages/MyProfile';
import MyAccount from './pages/MyAccount';
// Chef Admin pages
import ChefAdminLogin from './pages/chef-admin/Login';
import ChefAdminDashboard from './pages/chef-admin/Dashboard';
import ChefAdminMenu from './pages/chef-admin/Menu';
import ChefAdminMenuHistory from './pages/chef-admin/MenuHistory';
import ChefAdminSubscribers from './pages/chef-admin/Subscribers';
import ChefAdminOrders from './pages/chef-admin/Orders';
import ChefAdminDelivery from './pages/chef-admin/Delivery';
import ChefAdminDeliveryRoutes from './pages/chef-admin/DeliveryRoutes';
import ChefAdminSettings from './pages/chef-admin/Settings';
import ChefAdminMenuGallery from './pages/chef-admin/MenuGallery';
import ChefAdminSupport from './pages/chef-admin/Support';
// Super Admin pages
import SuperAdminLogin from './pages/superadmin/Login';
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import SuperAdminChefs from './pages/superadmin/Chefs';
import SuperAdminNewChef from './pages/superadmin/NewChef';
import SuperAdminConfig from './pages/superadmin/Config';
import SuperAdminChefConfig from './pages/superadmin/ChefConfig';
import SuperAdminUsers from './pages/superadmin/Users';

function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          {/* Client routes */}
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<DiscoverChefs />} />
          <Route path="/chefs/:slug" element={<ChefProfile />} />
          <Route path="/chefs/:slug/menu" element={<ChefMenu />} />
          <Route path="/chefs/:slug/subscribe" element={<Subscribe />} />
          <Route path="/my/subscriptions" element={<MySubscriptions />} />
          <Route path="/my/pickup-point" element={<MyPickupPoint />} />
          <Route path="/my/orders" element={<MyOrders />} />
          <Route path="/my/profile" element={<MyProfile />} />
          <Route path="/my/account" element={<MyAccount />} />
          <Route path="/support" element={<Support />} />
          <Route path="/my/profile" element={<MyProfile />} />
          <Route path="/my/account" element={<MyAccount />} />
          <Route path="/support" element={<Support />} />
          <Route path="/install" element={<Install />} />
          {/* Chef Admin routes */}
          <Route path="/chef-admin/login" element={<ChefAdminLogin />} />
          <Route path="/chef-admin/dashboard" element={<ChefAdminDashboard />} />
          <Route path="/chef-admin/menu" element={<ChefAdminMenu />} />
          <Route path="/chef-admin/menu/history" element={<ChefAdminMenuHistory />} />
          <Route path="/chef-admin/menu/gallery" element={<ChefAdminMenuGallery />} />
          <Route path="/chef-admin/subscribers" element={<ChefAdminSubscribers />} />
          <Route path="/chef-admin/orders" element={<ChefAdminOrders />} />
          <Route path="/chef-admin/delivery" element={<ChefAdminDelivery />} />
          <Route path="/chef-admin/delivery-routes" element={<ChefAdminDeliveryRoutes />} />
          <Route path="/chef-admin/settings" element={<ChefAdminSettings />} />
          <Route path="/chef-admin/support" element={<ChefAdminSupport />} />
          {/* Super Admin routes */}
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/chefs" element={<SuperAdminChefs />} />
          <Route path="/superadmin/chefs/new" element={<SuperAdminNewChef />} />
          <Route path="/superadmin/config" element={<SuperAdminConfig />} />
          <Route path="/superadmin/chefs/:chefId/config" element={<SuperAdminChefConfig />} />
          <Route path="/superadmin/users" element={<SuperAdminUsers />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}

export default App;
