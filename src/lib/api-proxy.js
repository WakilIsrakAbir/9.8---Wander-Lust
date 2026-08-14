const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const api = new Proxy({}, {
  get(target, endpoint) {
    return async (pathParams = '', options = {}) => {
      let path = endpoint;
      let fetchOptions = options;
      
      // If the first argument is a string or number, treat it as a sub-path (e.g. ID)
      if (typeof pathParams === 'string' || typeof pathParams === 'number') {
        const baseEndpoint = endpoint.replace(/_/g, '/');
        path = pathParams ? `${baseEndpoint}/${pathParams}` : baseEndpoint;
      } else if (typeof pathParams === 'object' && pathParams !== null) {
        // If the first argument is an object, treat it as fetch options
        const baseEndpoint = endpoint.replace(/_/g, '/');
        path = baseEndpoint;
        fetchOptions = pathParams;
      } else {
        path = endpoint.replace(/_/g, '/');
      }

      try {
        const response = await fetch(`${API_BASE_URL}/${path}`, fetchOptions);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'API request failed');
        }
        
        // Return a wrapper object if components expect to check 'ok' or similar
        // For simplicity, we just return the data payload. 
        return data;
      } catch (error) {
        console.error(`[API Proxy Error] ${path}:`, error);
        throw error;
      }
    };
  }
});
