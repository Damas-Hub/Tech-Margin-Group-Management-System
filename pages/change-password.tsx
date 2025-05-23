import React, { useState } from "react";
import { auth, db } from "../src/firebaseConfig";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from ".././componnets/ChangePassword.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        toast.error("User not found. Please log in again.");
        return;
      }

      let userRef = doc(db, "staffs", user.uid);
      let userSnap = await getDoc(userRef);
      let collectionName = "staffs";

      if (!userSnap.exists()) {
        userRef = doc(db, "users", user.uid);
        userSnap = await getDoc(userRef);
        collectionName = "users";
      }

      if (!userSnap.exists()) {
        toast.error("User record not found in Firestore.");
        return;
      }

      try {
        await updatePassword(user, newPassword);
      } catch (error: any) {
        if (error.code === "auth/requires-recent-login") {
          toast.error("Session expired. Please re-authenticate and try again.");
          return;
        } else {
          throw error;
        }
      }

      await updateDoc(userRef, { isFirstLogin: false });

      toast.success("Password changed successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      toast.error(`Failed to change password: ${error.message}`);
      console.error("Password Change Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className={styles.title}>Change Password</h2>
      <form className={styles.form} onSubmit={handleChangePassword}>
        <div className={styles.passwordInputContainer}>
          <input
            type={showNewPassword ? "text" : "password"}
            className={styles.input}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <span
            className={styles.toggleEye}
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        <div className={styles.passwordInputContainer}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            className={styles.toggleEye}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        </div>

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
