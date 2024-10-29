import axios from "axios";

const baseUrl = "http://localhost:9090";
const username = "Sampath";

const headers = {
  "X-Username": username,
};

export const getSecondaryWinners = async () => {
  try {
    const response = await axios.get(`${baseUrl}/secondary-winners`, { headers });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching secondary winners", error);
    if (error.response && error.response.status === 401) {
      //Received 401 Unauthorized response from API GW. The access token may have expired.

      // Try to refresh the token
      const refreshResponse = await fetch("/auth/refresh", {
        method: "POST",
      });

      const status = refreshResponse.status;
      if (status === 401) {
        // Session has expired (i.e., Refresh token has also expired).
        // Redirect to login page
        window.location.href = "/auth/login";
      }
      if (status !== 204) {
        // Tokens cannot be refreshed due to a server error.
        console.log("Failed to refresh token. Status: " + status);

        //  Throw the 401 error from API Gateway.
        throw error;
      }
      // Token refresh successful. Retry the API call.
      const response = await axios.get(`${baseUrl}/secondary-winners`, { headers });
      return response.data;
    } else {
      throw error;
    }
  }
};

export const getGrandWinner = async (payload) => {
  try {
    console.log("Before Payload: ", payload);
    const response = await axios.post(
      `${baseUrl}/grand-winner`,
      payload,
      { headers }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching grand winner", error);
    if (error.response && error.response.status === 401) {
      //Received 401 Unauthorized response from API GW. The access token may have expired.

      // Try to refresh the token
      const refreshResponse = await fetch("/auth/refresh", {
        method: "POST",
      });

      const status = refreshResponse.status;
      if (status === 401) {
        // Session has expired (i.e., Refresh token has also expired).
        // Redirect to login page
        window.location.href = "/auth/login";
      }
      if (status !== 204) {
        // Tokens cannot be refreshed due to a server error.
        console.log("Failed to refresh token. Status: " + status);

        //  Throw the 401 error from API Gateway.
        throw error;
      }
      // Token refresh successful. Retry the API call.
      const response = await axios.post(
        `${baseUrl}/grand-winner`,
        payload,
        { headers }
      );
      return response.data;
    } else {
      throw error;
    }
  }
};
