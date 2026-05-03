import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate = useNavigate();

  // 🧠 STATE
  const [step, setStep] = useState(1); // 1 = email, 2 = reset
  const [email, setEmail] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🧠 STEP 1: SEND OTP
  const handleSendOtp = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find((user) => user.email === email.trim());

    if (!userExists) {
      alert("Email not found");
      return;
    }

    // 🔥 Generate OTP (simulation)
    const otp = Math.floor(1000 + Math.random() * 9000);
    setGeneratedOtp(otp.toString());

    alert("Your OTP is: " + otp); // simulate sending email

    setStep(2);
  };

  // 🧠 STEP 2: RESET PASSWORD
  const handleResetPassword = (e) => {
    e.preventDefault();

    if (enteredOtp !== generatedOtp) {
      alert("Invalid OTP");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((user) =>
      user.email === email
        ? { ...user, password: newPassword }
        : user
    );

    // update users
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // 🔥 logout user after password change (better UX + realism)
    localStorage.removeItem("user");

    alert("Password updated successfully!");

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f4ee] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">

        <h2 className="text-2xl font-semibold text-center">
          Forgot Password
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">

            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3"
            />

            <button className="w-full bg-emerald-600 text-white py-3 rounded-xl">
              Send OTP
            </button>

          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">

            <input
              type="text"
              placeholder="Enter OTP"
              required
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3"
            />

            <input
              type="password"
              placeholder="New Password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3"
            />

            <button className="w-full bg-emerald-600 text-white py-3 rounded-xl">
              Reset Password
            </button>

          </form>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;