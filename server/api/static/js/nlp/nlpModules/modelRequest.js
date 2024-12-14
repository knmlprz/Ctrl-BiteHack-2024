// API POST Request to communicate with local LLM model
export function sendRequest(prompt) {
  const url = 'http://192.168.7.145:8000/api/generate';

  const selectedVehicle = "rover"

  const data = {
    model: 'wnuczek',
    prompt: prompt,
    stream: false,
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const commandActivator = data.response + selectedVehicle;

      if (data.response !== "unknown_command") {
        console.log(commandActivator);
        if (commandActivator == "start_rover") {
          sendToRobotForward()
        }else if (commandActivator == "stop_rover") {
          sendToRobotBackward()
        }
      }
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
    });
}
