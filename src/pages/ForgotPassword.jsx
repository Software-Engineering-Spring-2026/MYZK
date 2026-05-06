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
    <div className="relative min-h-screen overflow-hidden bg-[#f7f4ee] text-slate-900 antialiased flex items-center justify-center p-4 sm:p-8">
      {/* Background Blurs from Landing Page */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-amber-200/70 blur-3xl"></div>
        <div className="absolute right-[-6%] top-20 h-[360px] w-[360px] rounded-full bg-emerald-200/60 blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.22),transparent_55%),radial-gradient(circle_at_20%_70%,rgba(251,191,36,0.25),transparent_55%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(15,23,42,0.08)_0%,transparent_45%,rgba(15,23,42,0.06)_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6 border border-white/40">

        <h2 className="text-2xl font-semibold text-center">
          Forgot Password?
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