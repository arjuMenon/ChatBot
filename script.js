const typingInput = document.querySelector(".input");
const sendButton = document.querySelector(".send");
const chatList = document.querySelector('.message_area');

let userMessage = null;
const API_KEY = 'AIzaSyDRPPFF_rKn-ZEHC_nvzwBNmaYQyptsQv8';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const chatHistory = [];

// Function to create a message element
const createMessageElement = (content, className) => {
  const div = document.createElement("div");
  div.classList.add('message', className);
  div.innerHTML = content;
  return div;
};

// Function to show loading animation
const showLoadingAnimation = () => {
  const html = `
    <div class="img">
      <img src="luffypickingnose.jpg" style="width: 40px; height: 40px; border-radius: 50px;" alt="AI">
    </div>
    <div class="text">OneBrainCell is typing...</div>`;

  const loadingMessageDiv = createMessageElement(html, "incoming");
  chatList.appendChild(loadingMessageDiv);
  chatList.scrollTop = chatList.scrollHeight;
  return loadingMessageDiv;
};

// Function to generate API response
const generateAPIResponse = async (loadingMessageDiv) => {
  const textElement = loadingMessageDiv.querySelector(".text");
  chatHistory.push({ role: "user", parts: [{ text: userMessage }] })
  

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: chatHistory

      })
    });

    const data = await response.json();
    const apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    // Update the message div with the response
    textElement.innerHTML = apiResponse;
    chatHistory.push({ role: "model", parts: [{ text: userMessage }] })
    console.log(apiResponse);

  } catch (error) {
    console.log(error);
    textElement.innerHTML = "Sorry, something went wrong.";
  }
};

// Function to handle outgoing chat
const handleOutgoingChat = () => {
  userMessage = typingInput.value.trim();
  if (!userMessage) return;

  // User message template
  const userHtml = `
    <div class="img">
      <img src="hiluffy.jpg" style="width: 40px; height: 40px; border-radius: 50px;" alt="User">
    </div>
    <div class="text">${userMessage}</div>`;

  const outgoingMessageDiv = createMessageElement(userHtml, "outgoing");
  chatList.appendChild(outgoingMessageDiv);

  // Show loading animation for incoming response
  const loadingMessageDiv = showLoadingAnimation();

  // Generate API response and update the incoming message with the chatbot's reply
  generateAPIResponse(loadingMessageDiv);

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
