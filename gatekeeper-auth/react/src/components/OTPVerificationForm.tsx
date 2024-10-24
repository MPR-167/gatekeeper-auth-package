// OTPVerification.tsx
import React, { useState } from "react";
import axios from "axios";

type OTPVerificationProps = {
  email: string;
  onVerified: () => void;
};

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/verify-otp", {
        email,
        otp,
      });
      if (response.status === 200) {
        onVerified(); // Call the parent handler on successful OTP verification
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      <h3>Verify OTP</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleVerifyOTP}>
        <div>
          <label>OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default OTPVerification;
