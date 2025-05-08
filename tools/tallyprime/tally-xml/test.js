/**
 * Function to check whether Tally is running.
 *
 * @returns {Promise<Object>} - The result of the Tally status check.
 */
const executeFunction = async () => {
  const TallyURL = 'http://localhost'; // will be provided by the user
  const TallyPort = '9000'; // will be provided by the user
  try {
    // Construct the URL for the Tally request
    const url = `${TallyURL}:${TallyPort}`;

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml'
      }
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error checking Tally status:', error);
    return { error: 'An error occurred while checking Tally status.' };
  }
};

/**
 * Tool configuration for checking Tally status.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'check_tally_status',
      description: 'Check whether Tally is running.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };