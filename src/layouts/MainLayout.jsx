import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import ScrollProgress from "../components/ScrollProgress";

export default function MainLayout() {
  const { pathname } = useLocation();

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <PageTransition key={pathname}>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </>
  );
}
