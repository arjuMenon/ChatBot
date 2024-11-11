const typingInput = document.querySelector(".input");
const sendButton = document.querySelector(".send");
const chatList = document.querySelector('.message_area');

let userMessage = null;
const API_KEY = 'AIzaSyDRPPFF_rKn-ZEHC_nvzwBNmaYQyptsQv8'; // Replace this with your actual API key

// Updated API URL with the API key as a query parameter
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

// Function to create a message element
const createMessageElement = (content, className) => {
  const div = document.createElement("div");
  div.classList.add('message');
  className.split(' ').forEach(cls => div.classList.add(cls));
  div.innerHTML = `<div class="text">${content}</div>`;
  return div;
};

// Function to generate API response
const generateAPIResponse = async (outgoingMessageDiv) => {
  const textElement = outgoingMessageDiv.querySelector(".text");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: userMessage }]
        }]
      })
    });

    const data = await response.json();

    // Extract the response text
    const apiResponse = data?.candidates[0].content.parts[0].text;

    // Update the message div with the response
    textElement.innerHTML = apiResponse;
    console.log(apiResponse);

  } catch (error) {
    console.log(error);
    // Handle errors gracefully
    textElement.innerHTML = "Sorry, something went wrong.";
  }
};

// Function to handle outgoing chat
const handleOutgoingChat = () => {
  userMessage = typingInput.value.trim();
  if (!userMessage) return;

  // Create outgoing message div
  const outgoingMessageDiv = createMessageElement(userMessage, "outgoing");
  chatList.appendChild(outgoingMessageDiv);

  // Generate API response and update the outgoing message with the chatbot's reply
  generateAPIResponse(outgoingMessageDiv);

  chatList.scrollTop = chatList.scrollHeight;
  typingInput.value = "";
};

// Event listener for clicking the send button
sendButton.addEventListener("click", (e) => {
  e.preventDefault();
  handleOutgoingChat();
});

// Event listener for pressing the "Enter" key
typingInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleOutgoingChat();
  }
});
