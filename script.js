// 保存历史消息
let history = [];



document.getElementById("apiKeyForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const apiKey = document.getElementById("apiKey").value;
    localStorage.setItem("apiKey", apiKey);
});

document.getElementById("messageForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = document.getElementById("message").value;
    document.getElementById("message").value = "";
    displayMessage("user", message);

    history.push({ role: "user", content: message });

    const apiKey = localStorage.getItem("apiKey") || "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";

    setLoading(true);
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: history,
            }),
        });
    
        if (response.ok) {
            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;
            displayMessage("assistant", assistantMessage);
            history.push({ role: "assistant", content: assistantMessage });
        } else {
            const errorData = await response.json();
            displayMessage("assistant", `Error: ${errorData.error.message}`);
        }
    } catch (error) {
        displayMessage("assistant", `Error: ${error.message}`);
    } finally {
        setLoading(false);
    }
});

function displayMessage(role, message) {
const chat = document.getElementById("chat");
const messageElement = document.createElement("div");
messageElement.classList.add(role);
messageElement.textContent = message;
chat.appendChild(messageElement);
chat.scrollTop = chat.scrollHeight;
}

function setLoading(isLoading) {
const loadingElement = document.getElementById("loading");
if (isLoading) {
loadingElement.style.display = "block";
} else {
loadingElement.style.display = "none";
}
}
