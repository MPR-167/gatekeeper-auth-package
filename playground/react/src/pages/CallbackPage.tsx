// CallbackPage.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CallbackPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Extract the query parameters from the URL (code and state)
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    const state = queryParams.get('state');

    // Send the code and state back to the main window using postMessage
    if (code && state && window.opener) {
      window.opener.postMessage({ code, state }, window.origin);
      window.close(); // Close the popup after sending the message
    }
  }, [location.search]);

  return <p>Processing Google sign-in...</p>;
};

export default CallbackPage;
