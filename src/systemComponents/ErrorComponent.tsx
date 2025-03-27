import { Box, Text, Stack, Button } from "@chakra-ui/react";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ErrorComponent = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  // Log the error to console for debugging
  useEffect(() => {
    console.error("Route Error:", error);
  }, [error]);

  let errorMessage = "An unexpected error occurred";
  let errorDetails = "";

  // Check for network/API connection errors first
  if (error instanceof TypeError) {
    if (error.message.includes("Failed to fetch")) {
      errorMessage = "Connection Error";
      errorDetails =
        "Unable to connect to the server. Please check your internet connection and try again.";
    } else if (error.message.includes("NetworkError")) {
      errorMessage = "Network Error";
      errorDetails =
        "There was a problem with your network connection. Please check your internet and try again.";
    } else if (error.message.includes("timeout")) {
      errorMessage = "Request Timeout";
      errorDetails = "The server took too long to respond. Please try again.";
    }
  } else if (isRouteErrorResponse(error)) {
    // Handle specific route errors
    switch (error.status) {
      case 404:
        errorMessage = "Page not found";
        errorDetails = "The requested page could not be found.";
        break;
      case 401:
        errorMessage = "You are not authorized to access this page";
        errorDetails = "Please log in with the correct credentials.";
        break;
      case 403:
        errorMessage = "Access forbidden";
        errorDetails = "You don't have permission to access this resource.";
        break;
      case 500:
        errorMessage = "Server Error";
        errorDetails =
          "Something went wrong on our end. Please try again later.";
        break;
      case 503:
        errorMessage = "Service Unavailable";
        errorDetails =
          "The service is temporarily unavailable. Please try again later.";
        break;
      case 504:
        errorMessage = "Gateway Timeout";
        errorDetails =
          "The server is taking too long to respond. Please try again later.";
        break;
      case 502:
        errorMessage = "Bad Gateway";
        errorDetails =
          "The server received an invalid response. Please try again later.";
        break;
      default:
        errorMessage = error.data?.message || "Something went wrong";
        errorDetails = error.data?.details || "An unexpected error occurred";
    }
  } else if (error instanceof Error) {
    // Handle general errors
    errorMessage = error.message;
    errorDetails = error.stack || "No additional details available";
  }

  // Add retry count and timeout for API errors
  const handleRetry = () => {
    // Add a small delay before reloading to prevent immediate retry
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      p={4}
      textAlign="center"
      bg="gray.50"
    >
      <Stack gap={4} maxW="600px" w="full">
        <Text fontSize="2xl" fontWeight="bold" color="red.500">
          Oops! Something went wrong
        </Text>
        <Text fontSize="xl" color="gray.700">
          {errorMessage}
        </Text>
        <Text color="gray.600" fontSize="sm">
          {errorDetails}
        </Text>
        <Box display="flex" gap={4} justifyContent="center">
          <Button
            colorPalette="blue"
            variant="solid"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
          <Button colorPalette="blue" variant="outline" onClick={handleRetry}>
            Try Again
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default ErrorComponent;
