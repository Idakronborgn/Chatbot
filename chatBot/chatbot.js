
/* tilføjer specifikke elementer fra HTML dokumentet ved at gøre brug af deres class names */
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

// chatgpt's api key + textareas scroll height
let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;


const createChatLi = (message, className) => {
    // opretter en chat <li> element med besked/message og classname
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="chat-picture"><img src="./img/image.png" class="company-img"></span><p></p><span class="timestamp">${timestamp}</span>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}


// tilføjer/henter chatgpt api der generer beskeder til brugeren 
const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}]
        })

    }
    // send POST request til API, optag respons
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Noget gik galt. Prøv igen.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

/*
 * The handleChat function trims the user's input, checks if it is empty, and clears the chat input
 * field.
 */
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;


    // tilføjer brugerens beskeder til chatbox'en
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // tilføjer ai thinking beskeder mens brugeren venter på respons
        const incomingChatLi = createChatLi("Typing...","incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // justere højden på textarea baseret på indholdet
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown", (e) => {
    //hvis Enterkey er trykket uden shiftkey og vinduets bredde
    // er breddere end 800px, behandler den chatten
  if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
  
})

// Åbner og lukker chavinduet, når man klikker
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
sendChatBtn.addEventListener("click", handleChat);