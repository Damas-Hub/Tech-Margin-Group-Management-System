import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaSignOutAlt,
  FaComments,
  FaShoppingBag,
  FaHome,
  FaTools,
} from "react-icons/fa";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import styles from "../admin/AdminDashboard.module.css";

import NotificationModal from "@/componnets/NotificationModal";
import Message from "../admin/Message";
import RepairerClients from "../admin/RepairerClients";
import Home from "../admin/Home";
import Store from "./Store";
import Staffs from "../secretary/Staffs";
import NetworkBanner from "@/componnets/NetworkBanner";
import { FaUsersGear } from "react-icons/fa6";
import ProtectedRoute from "@/componnets/ProtectedRoute";
import { FiSearch } from "react-icons/fi";

const RepairerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("Home");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      label: "Home",
      icon: <FaHome className="w-6 h-6" />,
      component: <Home staffRole="Repairer" />,
    },
    {
      label: "Store",
      icon: <FaShoppingBag className="w-6 h-6" />,
      component: <Store searchTerm={searchTerm} staffRole="Repairer" />,
    },
    {
      label: "Messages",
      icon: <FaComments className="w-6 h-6" />,
      component: <Message />,
    },
    {
      label: "Staffs",
      icon: <FaUsersGear className="w-6 h-6" />,
      component: <Staffs />,
    },
    {
      label: "RepairerClients",
      icon: <FaTools className="w-6 h-6" />,
      component: <RepairerClients searchTerm={searchTerm} />,
    },
  ];

  const userRole = "Repairer";

  const handleLogout = () => {
    toast.success("Logged out successfully!", { duration: 3000 });
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize(); // Set initial width
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ProtectedRoute allowedRoles={["Repairer"]}>
      <NetworkBanner />
      <div className={`flex h-screen ${styles.mobileContainer}`}>

        <Toaster />

        {/* Sidebar */}
        <div
          className={`${styles.sidebar} ${
            isSidebarOpen
              ? `${styles.sidebarOpen} ${
                  screenWidth <= 450 ? styles.sidebarFullScreen : ""
                }`
              : styles.sidebarClosed
          }`}
        >
          <div className={styles.sidebarHeader}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={styles.menu}
            >
              <FaBars className="w-7 h-7" />
            </button>
          </div>

          <div className={styles.sidebarContent}>
            <nav>
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  className={`${styles.sidebarMenuItem} ${
                    activePage === item.label ? "bg-[#B05858] " : ""
                  }`}
                  onClick={() => {
                    setActivePage(item.label);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                >
                  {item.icon}
                  <span
                    className={`${styles.sidebarMenuText} ${
                      !isSidebarOpen && "hidden"
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
            <div className={styles.logout}>
              <button
                className={styles.sidebarMenuIthem}
                onClick={() => setShowLogoutModal(true)}
              >
                <FaSignOutAlt className="w-7 h-7" />
                <span
                  className={`${styles.sidebarMenuText} ${
                    !isSidebarOpen && "hidden"
                  }`}
                >
                  
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <header className={styles.header}>
            <div className="flex flex-wrap items-center justify-between gap-4 p-4">
              {/* Search Box */}
              <div className={`${styles.searchWrapper} flex-1 min-w-[100px]`}>
                <FiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Notification & Avatar */}
              <div className="flex items-center gap-3 sm:gap-6 ml-auto">
                <NotificationModal
                  staffRole={userRole}
                  className="w-7 h-7 cursor-pointer text-red-600"
                />

                <Image
                  src="https://cdn.vectorstock.com/i/1000v/31/40/mechanic-logo-vector-44593140.jpg"
                  alt="Logo"
                  width={35}
                  height={35}
                  className="w-12 h-12 rounded-full"
                />
              </div>
            </div>
          </header>

          {/* Render Active Page */}
          <main className={styles.contentArea}>
            <div className={styles.contentCard}>
              {menuItems.find((item) => item.label === activePage)
                ?.component || (
                <h2 className="text-2xl font-semibold">Page Not Found</h2>
              )}
            </div>
          </main>
        </div>
        <footer className="bg-[#56021f] text-white py-1 sm:py-2 text-center fixed bottom-0 w-full">
          <p className="text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} TechMarginGroup. Developed by{" "}
            <a
              href="https://hubertdhk.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              DamasHub
            </a>
          </p>
        </footer>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl text-center w-full max-w-md mx-4 min-h-[220px] flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-6 text-gray-800">
                  Are you sure you want to log out?
                </h2>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors duration-200 flex-1 max-w-[160px]"
                  onClick={() => {
                    setShowLogoutModal(false);
                    handleLogout();
                  }}
                >
                  Yes, Logout
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-base font-medium transition-colors duration-200 flex-1 max-w-[160px]"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default RepairerDashboard;
