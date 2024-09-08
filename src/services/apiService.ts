export async function makeApiRequest(
  amount: number,
  difficulty: string,
  selectedCategory: number,
  token: string
) {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=${selectedCategory}&difficulty=${difficulty}&token=${token}`
  );

  if (!response.ok) {
    handleHttpError(response);
  }

  return response;
}

export function handleHttpError(response: Response) {
  switch (response.status) {
    case 400:
      throw new Error("Bad Request: The request was invalid.");
    case 401:
      throw new Error("Unauthorized: Access token is missing or invalid.");
    case 403:
      throw new Error(
        "Forbidden: You do not have permission to access this resource."
      );
    case 404:
      throw new Error("Not Found: The requested resource could not be found.");
    case 429:
      throw new Error(
        "Too Many Requests: Please wait a few moments before trying again."
      );
    case 500:
      throw new Error(
        "Internal Server Error: Something went wrong on the server."
      );
    case 502:
      throw new Error(
        "Bad Gateway: Invalid response from the upstream server."
      );
    case 503:
      throw new Error(
        "Service Unavailable: The server is currently unable to handle the request."
      );
    case 504:
      throw new Error("Gateway Timeout: The server took too long to respond.");
    default:
      throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
}
