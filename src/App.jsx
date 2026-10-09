import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { CustomerAuthPage } from './pages/CustomerAuthPage';
import { DriverAuthPage } from './pages/DriverAuthPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { PickupRequestWizard } from './pages/PickupRequestWizard';
import { CustomerTrackingPage } from './pages/CustomerTrackingPage';
import { DriverDashboardPage } from './pages/DriverDashboardPage';
import { DriverTripsPage } from './pages/DriverTripsPage';
import { DriverIncomingRequestsPage } from './pages/DriverIncomingRequestsPage';
import { DriverDeliveryStatusPage } from './pages/DriverDeliveryStatusPage';
import { DeliveryCompletedPage } from './pages/DeliveryCompletedPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { EarningsPage } from './pages/EarningsPage';
import { ProfilePage } from './pages/ProfilePage';
import { DemoSwitcher } from './components/DemoSwitcher';

const MainContent = () => {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'customer-login':
        return <CustomerAuthPage />;
      case 'driver-login':
        return <DriverAuthPage />;
      case 'customer-dashboard':
        return <CustomerDashboardPage />;
      case 'request-pickup':
        return <PickupRequestWizard />;
      case 'track-request':
        return <CustomerTrackingPage />;
      case 'driver-dashboard':
        return <DriverDashboardPage />;
      case 'my-trips':
        return <DriverTripsPage />;
      case 'shipment-requests':
        return <DriverIncomingRequestsPage />;
      case 'delivery-status':
        return <DriverDeliveryStatusPage />;
      case 'earnings':
        return <EarningsPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'completion':
        return <DeliveryCompletedPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 font-sans">
      {renderView()}
      <DemoSwitcher />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
