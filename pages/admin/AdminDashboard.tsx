import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiSearch, FiMenu } from "react-icons/fi";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import styles from "./AdminDashboard.module.css";
import Clients from "./Clients";
import Store from "./Store";
import Message from "./Message";
import Staffs from "./Staffs";
import Home from "./Home";
import RepairerClients from "./RepairerClients";
import NotificationModal from "@/componnets/NotificationModal";
import {
  FaComments,
  FaHome,
  FaShoppingBag,
  FaSignOutAlt,
  FaTools,
  FaUsers,
} from "react-icons/fa";
import NetworkBanner from "@/componnets/NetworkBanner";
import { MdOutlineLocalGroceryStore } from "react-icons/md";
import RequestedItems from "../store/RequestedItem";
import { FaUsersGear } from "react-icons/fa6";
import ProtectedRoute from "@/componnets/ProtectedRoute";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("Home");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    {
      label: "Home",
      icon: <FaHome className="w-7 h-7" />,
      component: <Home staffRole="Admin" />,
    },
    {
      label: "Store",
      icon: <FaShoppingBag className="w-7 h-7" />,
      component: <Store searchTerm={searchTerm} staffRole="Repairer" />,
    },
    {
      label: "Clients",
      icon: <FaUsers className="w-7 h-7" />,
      component: <Clients searchTerm={searchTerm} />,
    },
    {
      label: "Messages",
      icon: <FaComments className="w-7 h-7" />,
      component: <Message />,
    },
    {
      label: "Staffs",
      icon: <FaUsersGear className="w-7 h-7" />,
      component: <Staffs />,
    },
    {
      label: "RepairerClients",
      icon: <FaTools className="w-7 h-7" />,
      component: <RepairerClients searchTerm={searchTerm} />,
    },
    {
      label: "RequestedItem",
      icon: <MdOutlineLocalGroceryStore className="w-7 h-7" />,
      component: <RequestedItems />,
    },
  ];

  const userRole = "Admin";

  const handleLogout = () => {
    toast.success("Logged out successfully!", { duration: 3000 });
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile if it's open
      if (window.innerWidth < 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
      // Auto-open sidebar on desktop if it's closed (unless user toggled it)
      if (window.innerWidth >= 768 && !isSidebarOpen && !manuallyToggled) {
        setIsSidebarOpen(true);
      }
    };

    // Initialize on mount
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  // Track if user manually toggled the sidebar
  const [manuallyToggled, setManuallyToggled] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setManuallyToggled(true);
  };

  return (
    <>
      <ProtectedRoute allowedRoles={["Admin"]}>
        <NetworkBanner />
        <div className="flex h-screen">
          <Toaster />
          {/* Sidebar */}
          <div
            className={`${styles.sidebar} ${
              isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
            }`}
          >
            <div className={styles.sidebarHeader}>
              <button onClick={toggleSidebar} className={styles.menu}>
                <FiMenu className="w-8 h-8" />
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
                    onClick={() => setActivePage(item.label)}
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
                  className={styles.sidebarMenuItem}
                  onClick={() => setShowLogoutModal(true)}
                >
                  <FaSignOutAlt className="w-7 h-7" />
                  <span
                    className={`${styles.sidebarMenuText} ${
                      !isSidebarOpen && "hidden"
                    }`}
                  >
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            <header className={styles.header}>
              <div className="flex items-center justify-between p-4">
                <div className={styles.searchWrapper}>
                  <FiSearch className={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-12 ml-auto">
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
        </div>

        {/* Footer */}
        <footer className="bg-[#56021f] text-white py-2 text-center fixed bottom-0 w-full">
          <p className="text-sm">
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
      </ProtectedRoute>
    </>
  );
};

export default AdminDashboard;
