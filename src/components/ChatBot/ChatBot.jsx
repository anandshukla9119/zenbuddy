import React, { useState } from 'react';
import './ChatBot.css'; // ✅ Corrected CSS import
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Avatar
} from '@chatscope/chat-ui-kit-react';

import { API_KEY } from './config'; // Make sure your API key is properly defined here

const systemMessage = {
  role: "system",
  content: "Explain things like you're talking to a software professional with 2 years of experience."
};

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ZenBuddy! 🌈 Your Mental Health Companion!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // toggle visibility

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((msg) => ({
      role: msg.sender === "ChatGPT" ? "assistant" : "user",
      content: msg.message
    }));

    const apiRequestBody = {
      model: "gpt-4o-mini",
      messages: [systemMessage, ...apiMessages]
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });

      const data = await response.json();
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...chatMessages, {
        message: "⚠️ Oops! Something went wrong. Try again.",
        sender: "ChatGPT"
      }]);
    }

    setIsTyping(false);
  }

  return (
    <div className={`chat-container ${isVisible ? 'show' : 'hide'}`}>
      {isVisible && (
        <>
          {/* 💬 Neon Heading */}
          <h2 className="chat-heading">💬 ZenBuddy - Your Mental Health Chatbot</h2>

          <MainContainer className="chat-box">
            <button className="close-btn" onClick={() => setIsVisible(false)}>❌</button>

            <ChatContainer>
              <MessageList
                scrollBehavior="smooth"
                typingIndicator={isTyping ? <TypingIndicator content="ZenBuddy is typing..." /> : null}
              >
                {messages.map((message, i) => (
                  <Message
                    key={i}
                    model={{
                      message: message.message,
                      sentTime: message.sentTime,
                      sender: message.sender,
                      direction: message.sender === "user" ? "outgoing" : "incoming",
                      position: "single"
                    }}
                  >
                    {message.sender === "ChatGPT" && (
                      <Avatar
                        src="https://cdn-icons-png.flaticon.com/512/4712/4712103.png"
                        name="ZenBuddy"
                        size="sm"
                      />
                    )}
                  </Message>
                ))}
              </MessageList>

              <MessageInput placeholder="Type your message..." onSend={handleSend} />
            </ChatContainer>
          </MainContainer>
        </>
      )}

      {!isVisible && (
        <button className="open-btn" onClick={() => setIsVisible(true)}>💬 Chat with ZenBuddy</button>
      )}
    </div>
  );
}

export default ChatBot;
