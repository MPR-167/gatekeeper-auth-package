import axios from "axios";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { getPublicEnvVariables } from "../lib/getEnvVariable";
import { decryptJsonData } from "../lib/utils";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
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

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [customRoleId, setCustomRoleId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [providers, setProviders] = useState<{
    isGoogleProvider: boolean;
    isGithubProvider: boolean;
    isVerificationCodeToEmail: boolean;
  }>({
    isGoogleProvider: false,
    isGithubProvider: false,
    isVerificationCodeToEmail: false,
  });

  useEffect(() => {
    async function decrypt() {
      const { publishableKey, iv, secret } = getPublicEnvVariables();

      const data : any = await decryptJsonData(
        { encryptedData: publishableKey as string, iv: iv as string },
        secret as string
      );

      const { tenantId, projectId, customRoleId, clientSecret } = data;

      setTenantId(tenantId);
      setProjectId(projectId);
      setCustomRoleId(customRoleId);
      setClientSecret(clientSecret);

      // Fetch the project info using clientSecret
      if (clientSecret) {
        const projectInfo = await fetchProjectInfo(clientSecret);
        setProviders({
          isGoogleProvider: projectInfo.isGoogleProvider,
          isGithubProvider: projectInfo.isGithubProvider,
          isVerificationCodeToEmail: projectInfo.isVerificationCodeToEmail,
        });
      }
    }

    decrypt();
  }, []);

  const fetchProjectInfo = async (clientSecret: string) => {
    try {
      const response = await axios.post("/genrate-auth-url", {
        clientSecret,
      });
      return response.data; // project data contains provider info, etc.
    } catch (error) {
      console.error("Error fetching project info:", error);
      throw new Error("Failed to fetch project information.");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "/login-with-credentials",
        {
          email,
          password,
          tenantId,
          projectId,
        }
      );
      if (response.status === 200) {
        setIsAuthenticated(true);
        if (providers.isVerificationCodeToEmail) {
          // Wait for email OTP verification
          console.log("Please check your email for the OTP.");
        }
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    try {
      const response = await axios.post(
        "/register-with-credentials",
        {
          email,
          username,
          password,
          tenantId,
          projectId,
          customRoleId,
        }
      );
      if (response.status === 201) {
        setIsAuthenticated(true);
        if (providers.isVerificationCodeToEmail) {
          console.log("Please check your email for the verification code.");
        }
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setIsAuthenticated(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      const response = await axios.post("/verify-otp", {
        email,
        otp,
      });
      if (response.status === 200) {
        console.log("OTP verified successfully!");
        setIsAuthenticated(true);
      } else {
        throw new Error("OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    }
  };

  const logout = () => {
    console.log("Logging out");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, register, verifyOTP }}
    >
      {children}
    </AuthContext.Provider>
  );
}
