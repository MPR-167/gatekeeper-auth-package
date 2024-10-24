import axios from 'axios';
import React, { useState } from 'react';

type OTPProps = {
  email: string;
};

const OTP = ({ email }: OTPProps) => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await axios.post("http://localhost:4000/api/v1/verify-otp", {
        email,
        otp,
      });
      if (response.status === 200) {
        
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (err) {
      console.error("Invalid OTP. Please try again.");
    }
  };
  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyOTP(email, otp);
    } catch (err) {
      console.error("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
    console.log(`Verifying OTP for email: ${email}`);
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleOTPSubmit}>
      <h3 className="text-lg font-semibold mb-2">Enter OTP sent to {email}</h3>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <button
        onClick={handleOTPSubmit}
        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      >
        Verify OTP
      </button>
      </form>
    </div>
  );
};

export default OTP;
