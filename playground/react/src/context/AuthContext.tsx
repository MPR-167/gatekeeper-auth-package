// const projectData = {
//   id: "c48014e2-c152-4d79-a1f5-1e5d39741890",
//   name: "Nigga blaster",
//   description: "niggas",
//   tenantId: "83ac1f76-a723-480c-a9a3-509176770b15",
//   createdAt: "2024-10-24T16:41:48.039Z",
//   updatedAt: "2024-10-24T17:13:08.625Z",
//   clientId: "00a762d6-dbe3-4e4c-ac78-701becaa7aad",
//   clientSecret:
//     "2cda1323d79a5d6bdc48c7233f81d6acdc2effc2035445bdbd66cebce9e3ba3a51c2f75a84aa6fd3aeec8b495de09c8af75e843b4d1ed89be93d6ae1e00b7c682204a8f65c4cec37e4868c09436ec6d4",
//   isUserNameRequired: false,
//   isGoogleProvider: true,
//   isGithubProvider: false,
//   isVerificationCodeToEmail: true,
//   userRoles: [],
//   defaultUserRole: null,
// };
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
import { getPublicEnvVariables } from "@/lib/getEnvVariable";

type Providers = {
  isGoogleProvider: boolean;
  isGithubProvider: boolean;
  isVerificationCodeToEmail: boolean;
};

type AuthResponse = {
  requiresOTP: boolean;
  user?: any;
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  providers: Providers;
  projectId: string | null;
  clientSecret: string | null;
  clientId: string | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  initiateOAuthFlow: (provider: "google" | "github") => Promise<void>;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

const API_BASE_URL = "http://localhost:4000/api/v1";

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [providers, setProviders] = useState<Providers>({
    isGoogleProvider: false,
    isGithubProvider: false,
    isVerificationCodeToEmail: false,
  });
  const [clientId, setClientId] = useState<string | null>(null);

  // Initialize auth state and fetch project configuration
  useEffect(() => {
    async function initialize() {
      try {
        const { clientSecret, clientId } = getPublicEnvVariables();
        if (clientSecret && clientId) {
          console.log(clientId, "        ", clientSecret)
          const projectInfo = (await axios.post(
            "http://localhost:4000/api/v1/get-project",
            {
              clientSecret,
              clientId,
            },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          )) as any;
          const projectData = projectInfo.data.data;

          setProjectId(projectData.id);
          setClientSecret(clientSecret);
          setClientId(clientId);
          setProviders({
            isGoogleProvider: projectData.isGoogleProvider,
            isGithubProvider: projectData.isGithubProvider,
            isVerificationCodeToEmail: projectData.isVerificationCodeToEmail,
          });
        }

        // Check if user is already authenticated
        // const session = await checkSession();
        // if (session) {
        //   setIsAuthenticated(true);
        //   setUser(session.user);
        // }
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to initialize authentication");
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, []);

  // const checkSession = async () => {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/check-session`, {
  //       withCredentials: true,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     return null;
  //   }
  // };

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/login-with-credentials`,
        {
          email,
          password,
          projectId,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser(response.data.user);

        return {
          requiresOTP:
            providers.isVerificationCodeToEmail &&
            !response.data.user.isVerified,
          user: response.data.user,
        };
      }

      return { requiresOTP: false };
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/register-with-credentials`,
        {
          email,
          username,
          password,
          projectId,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        if (!providers.isVerificationCodeToEmail) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        }
        return {
          requiresOTP: providers.isVerificationCodeToEmail,
          user: response.data.user,
        };
      }

      return { requiresOTP: false };
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/logout-user`,
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
      setUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        email,
        otp,
        projectId,
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const initiateOAuthFlow = async (provider: "google" | "github") => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/genrate-auth-url`, {
        clientSecret,
        provider,
        projectId,
      });

      if (response.data.authUrl) {
        window.location.href = response.data.authUrl;
      } else {
        throw new Error("No authentication URL received");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || `${provider} authentication failed`
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const provider = urlParams.get("provider");

      if (code && provider) {
        setIsLoading(true);
        try {
          const response = await axios.post(
            `${API_BASE_URL}/auth-callback`,
            {
              code,
              provider,
              projectId,
            },
            { withCredentials: true }
          );

          if (response.status === 200) {
            setIsAuthenticated(true);
            setUser(response.data.user);
            // Redirect to success page or dashboard
            window.location.href = "/dashboard";
          }
        } catch (err: any) {
          setError(err.response?.data?.message || "OAuth callback failed");
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleOAuthCallback();
  }, []);

  const value = {
    isAuthenticated,
    isLoading,
    user,
    providers,
    projectId,
    clientSecret,
    login,
    register,
    logout,
    verifyOTP,
    initiateOAuthFlow,
    error,
    clientId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
