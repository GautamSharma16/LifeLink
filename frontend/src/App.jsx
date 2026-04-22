import { Route, Routes } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import Layout from "./components/Layout";
import ProtectedWrapper from "./utils/ProtectedRoutes";
import UnprotectedWrapper from "./utils/UnprotectedRoutes";
import Auth from "./pages/Auth";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";
import ProfileV2 from "./pages/ProfileV2";
import ResetPassword from "./pages/ResetPassword";
import RoleDashboard from "./pages/RoleDashboard";
import AmbulancePage from "./pages/Ambulance";
import DonateBloodPage from "./pages/DonateBlood";
import HospitalsPage from "./pages/Hospital";
import RequestBloodPage from "./pages/BloodNeed";
import VolunteersPage from "./pages/Volunteers";


function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={
        <PublicLayout>
          <Home />
        </PublicLayout>
      } />
      <Route path="/about" element={
        <PublicLayout>
          <About />
        </PublicLayout>
      } />
      <Route path="/services" element={
        <PublicLayout>
          <Services />
        </PublicLayout>
      } />
      <Route path="/contact" element={
        <PublicLayout>
          <Contact />
        </PublicLayout>
      } />
      {/* Auth pages */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/login" element={
        <UnprotectedWrapper>
          <Auth />
        </UnprotectedWrapper>
      } />
      {/* Protected dashboard area */}
      <Route path="/dashboard" element={
        <ProtectedWrapper>
          <Layout>
            <RoleDashboard />
          </Layout>
        </ProtectedWrapper>
      } />
      <Route path="/notifications" element={
        <ProtectedWrapper>
          <Layout>
            <Notifications />
          </Layout>
        </ProtectedWrapper>
      } />
      <Route path="/profile" element={
        <ProtectedWrapper>
          <Layout>
            <ProfileV2 />
          </Layout>
        </ProtectedWrapper>
      } />
      {/* Other pages - decide public/protected */}
      <Route path="/donate-blood" element={
        <ProtectedWrapper>
          <Layout>
            <DonateBloodPage />
          </Layout>
        </ProtectedWrapper>
      } />

      <Route path="/request-blood" element={
        <ProtectedWrapper>
          <Layout>
            <RequestBloodPage />
          </Layout>
        </ProtectedWrapper>
      } />

      <Route path="/ambulance" element={
        <ProtectedWrapper>
          <Layout>
            <AmbulancePage />
          </Layout>
        </ProtectedWrapper>
      } />

      <Route path="/hospitals" element={
        <ProtectedWrapper>
          <Layout>
            <HospitalsPage />
          </Layout>
        </ProtectedWrapper>
      } />

      <Route path="/volunteers" element={
        <ProtectedWrapper>
          <Layout>
            <VolunteersPage />
          </Layout>
        </ProtectedWrapper>
      } />

      <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
    </Routes>
  );
}


export default App;
