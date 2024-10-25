import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import axios, { AxiosError } from 'axios';

// Type definitions
interface RegistrationFormData {
  email: string;
  username: string;
  password: string;
}

interface OTPVerificationResponse {
  success: boolean;
  message: string;
}

interface GoogleAuthResponse {
  authUrl?: string;
  error?: string;
}

interface AuthProviders {
  isGoogleProvider: boolean;
}

// API endpoints configuration
const API_CONFIG = {
  baseURL:'http://localhost:4000',
  endpoints: {
    verifyOTP: '/api/v1/verify-otp',
    generateAuthUrl: '/api/v1/genrate-auth-url',
    googleSignIn: '/api/v1/auth-callback'
  }
};

export const Register = () => {
  // State management
  const [formData, setFormData] = useState<RegistrationFormData>({
    email: '',
    username: '',
    password: ''
  });
  const [otp, setOtp] = useState<string>('');
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Auth context
  const { register, providers, projectId, clientSecret, clientId } = useAuth();

  // Form input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Registration handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Basic validation
      if (!formData.email || !formData.username || !formData.password) {
        throw new Error('All fields are required');
      }
      
      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      const res = await register(formData.email, formData.username, formData.password);
      setShowOTP(res.requiresOTP);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // OTP verification
  const verifyOTP = async (email: string, otpCode: string): Promise<OTPVerificationResponse> => {
    try {
      const response = await axios.post<OTPVerificationResponse>(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.verifyOTP}`,
        { email, otp: otpCode }
      );
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('OTP verification failed. Please try again.');
    }
  };

  // OTP submission handler
  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await verifyOTP(formData.email, otp);
      if (response.success) {
        // Handle successful verification
        // You might want to redirect to login or dashboard here
        window.location.href = '/dashboard';
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign In handler=

const handleGoogleSignIn = async () => {
  try {
    const response = await axios.post<GoogleAuthResponse>(
      `${API_CONFIG.baseURL}${API_CONFIG.endpoints.generateAuthUrl}`,
      {
        clientId: '768942326999-e8cskt47nsv7phhvreapj3i108ogm2i1.apps.googleusercontent.com',
        clientSecret: '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',
        provider: 'google',
        redirectUri: `${window.location.origin}/api/auth/callback/google`,
        projectId,
        gateKeepClient: clientId,
        gateKeepSecret: clientSecret,
      }
    );

    if (!response.data.data.authUrl) {
      throw new Error('Failed to generate authentication URL');
    }

    const popup = window.open(
      response.data.data.authUrl,
      'Google Sign In',
      'width=500,height=600,left=0,top=0'
    );

    if (!popup) {
      throw new Error('Popup blocked. Please enable popups for this site.');
    }

    // Listen for messages from the popup window
    const messageHandler = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const { code, state } = event.data;
      if (code && state) {
        window.removeEventListener('message', messageHandler);
        popup.close();

        try {
          await axios.post(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.googleSignIn}`, {
            code,
            state,
            clientId: '768942326999-e8cskt47nsv7phhvreapj3i108ogm2i1.apps.googleusercontent.com',
            clientSecret: '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',
            provider: 'google',
            gateKeepClient: clientId,
            gateKeepSecret: clientSecret,
          },
          {
            headers: { "Content-Type": "application/json"},
            withCredentials: true,
          }
        );
          // Redirect to dashboard on successful sign-in
          window.location.href = '/';
        } catch (err) {
          console.error('Google sign-in failed. Please try again.');
        }
      }
    };

    window.addEventListener('message', messageHandler);
  } catch (err) {
    console.error(err instanceof Error ? err.message : 'Failed to initialize Google sign-in');
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {showOTP ? 'Verify OTP' : 'Create an Account'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            // <Alert variant="destructive" className="mb-4">
            //   <AlertDescription>{error}</AlertDescription>
            // </Alert>
            <p>{error}</p>
          )}
          
          {!showOTP ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                  className="w-full"
                  autoComplete="email"
                />
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  required
                  className="w-full"
                  autoComplete="username"
                />
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
                  className="w-full"
                  autoComplete="new-password"
                  minLength={8}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              {providers?.isGoogleProvider && (
                <>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    className="w-full"
                    disabled={isLoading}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign up with Google
                  </Button>
                </>
              )}
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Please enter the OTP sent to {formData.email}
              </p>
              <Input
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.trim())}
                placeholder="Enter OTP"
                required
                className="w-full"
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
              />
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;