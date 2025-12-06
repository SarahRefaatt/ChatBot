// app/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";

type Message = { 
  role: "user" | "assistant" | "system"; 
  content: string; 
  timestamp?: Date;
  model?: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    setError(null);
    const userMsg: Message = { 
      role: "user", 
      content: input.trim(),
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
   console.log("Sending messages:", updatedMessages);

const cleaned = updatedMessages
  .filter(m => m.content)
  .map(m => ({
    role: m.role,
    content: m.content
  }));

const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: cleaned }),
});

const data = await res.json();
console.log("Response data:", data);


      // if (!res.ok) {
      //   throw new Error(data.error || `HTTP error! status: ${res.status}`);
      // }

      const botMsg: Message = { 
        role: "assistant", 
        content: data.reply,
        timestamp: new Date(),
        model: "llama-3.3-70b-versatile"
      };
      setMessages(prev => [...prev, botMsg]);
      
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMessage = err.message.includes("GROQ_API_KEY") 
        ? "API configuration error. Please check server setup."
        : "Sorry, I'm experiencing high traffic. Please try again in a moment.";
      
      setError(errorMessage);
      const errMsg: Message = { 
        role: "assistant", 
        content: errorMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const quickActions = [
    {
      title: "Explain quantum computing",
      prompt: "Can you explain quantum computing in simple terms? Focus on key concepts like qubits, superposition, and entanglement."
    },
    {
      title: "Creative writing",
      prompt: "Write a short sci-fi story about a world where AI and humans coexist peacefully."
    },
    {
      title: "Research help", 
      prompt: "What are the latest advancements in renewable energy technology? Summarize the key developments."
    },
    {
      title: "Business idea",
      prompt: "Suggest an innovative startup idea that combines sustainability with technology, including potential market and implementation."
    }
  ];

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    // Auto-focus on textarea after setting the prompt
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };
// return (
//   <div className="h-screen bg-gray-900 flex flex-col text-white">
//     {/* Header */}
//     <div className="bg-black border-b border-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between shadow-md">
//       <div className="flex items-center space-x-4">
//         <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//           <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//           </svg>
//         </div>
//         <div>
//           <h1 className="text-xl font-bold text-white">ChatBot</h1>
//           <p className="text-gray-400 text-sm">Powered by Groq • Lightning fast AI</p>
//         </div>
//       </div>

//       <div className="flex items-center space-x-4">
//         {messages.length > 0 && (
//           <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//             <span>Model: llama-3.3-70b</span>
//           </div>
//         )}
//         <button
//           onClick={clearChat}
//           className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200 border border-gray-700"
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//           </svg>
//           <span className="text-sm font-medium">New Chat</span>
//         </button>
//       </div>
//     </div>

//     {/* Main Content Area */}
//     <div className="flex-1 flex overflow-hidden">
//       {/* Sidebar */}
//       <div className="w-72 bg-black border-r border-gray-800 hidden lg:block p-6 flex-shrink-0">
//         <div className="space-y-6">
       
          
//           <div>
//             <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Model Info</h3>
//             <div className="bg-gray-800 rounded-lg p-4 space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-400">Model:</span>
//                 <span className="text-sm font-medium text-white">Llama 3.3 70B</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-400">Provider:</span>
//                 <span className="text-sm font-medium text-white">Groq</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-400">Speed:</span>
//                 <span className="text-sm font-medium text-green-500">Fast</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Messages Container */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-black">
//           {messages.length === 0 && (
//             <div className="h-full flex items-center justify-center">
//               <div className="text-center max-w-2xl">
              
//                 <h2 className="text-3xl font-bold text-white mb-4">Chat with Llama 3.3 70B</h2>
//                 <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
//                   Experience lightning-fast responses from one of the most advanced AI models. 
//                   Ask complex questions, get creative content, or explore any topic.
//                 </p>
              
//               </div>
//             </div>
//           )}

//           {messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//             >
//               <div className="flex max-w-[85%] space-x-4">
//                 {/* {msg.role === "assistant" && (
//                   <div className="flex-shrink-0">
//                     <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//                       <span className="text-white text-xs font-bold">AI</span>
//                     </div>
//                   </div>
//                 )} */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center space-x-2 mb-1">
//                     {/* <span className="text-sm font-medium">{msg.role === "user" ? "You" : "Llama 3.3 70B"}</span> */}
//                     <span className="text-xs text-gray-400">
//                       {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </span>
//                     {/* {msg.model && (
//                       <span className="text-xs bg-blue-700 text-white px-2 py-0.5 rounded-full">
//                         {msg.model}
//                       </span>
//                     )} */}
//                   </div>
//                   <div
//                     className={`px-6 py-4 rounded-2xl break-words ${
//                       msg.role === "user"
//                         ? "bg-blue-600 text-white rounded-br-md shadow-lg"
//                         : "bg-gray-800 text-gray-300 border border-gray-700 rounded-bl-md shadow-sm"
//                     }`}
//                   >
//                     <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</div>
//                   </div>
//                 </div>
//                 {/* {msg.role === "user" && (
//                   <div className="flex-shrink-0">
//                     <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
//                       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                     </div>
//                   </div>
//                 )} */}
//               </div>
//             </div>
//           ))}

//           {loading && (
//             <div className="flex justify-start">
//               <div className="flex space-x-4 max-w-[85%]">
              
//                 <div className="flex-1">
//                   <div className="flex items-center space-x-2 mb-1">
//                     <span className="text-sm font-medium">Llama 3.3 70B</span>
//                     <span className="text-xs text-gray-400">Thinking...</span>
//                   </div>
//                   <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-md px-6 py-4 shadow-sm">
//                     <div className="flex space-x-2 items-center">
//                       <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce"></div>
//                       <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
//                       <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
//                       <span className="text-sm text-gray-400 ml-2">Processing with Groq...</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="mx-6 mb-4 p-4 bg-red-900 border border-red-700 rounded-xl">
//             <div className="flex items-center space-x-2 text-red-400">
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span className="text-sm font-medium">{error}</span>
//             </div>
//           </div>
//         )}

//         {/* Input Area */}
//         <div className="border-t border-gray-800 bg-black p-4 sm:p-6">
//   <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-end sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
    
//     {/* Textarea */}
//     <div className="flex-1 relative w-full">
//       <textarea
//         ref={textareaRef}
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Ask Llama 3.3 70B anything..."
//         className="w-full px-5 py-3 pr-14 border border-gray-700 rounded-3xl resize-none bg-gray-800 placeholder-gray-500 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-inner transition-all duration-200 leading-relaxed"
//         rows={1}
//         disabled={loading}
//       />
//       <div className="absolute right-4 top-3 text-gray-500">
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//         </svg>
//       </div>
//     </div>

//     {/* Send Button */}
//     <button
//       onClick={sendMessage}
//       disabled={!input.trim() || loading}
//       className="flex-shrink-0 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
//     >
//       {loading ? (
//         <>
//           <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//           <span className="text-sm">Processing...</span>
//         </>
//       ) : (
//         <>
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//           </svg>
//           <span className="text-sm">Send</span>
//         </>
//       )}
//     </button>
//   </div>

//   {/* Footer Info */}
//   <div className="mt-3 flex flex-col sm:flex-row items-center justify-between text-gray-400 text-xs space-y-1 sm:space-y-0">
//     <span>Llama 3.3 70B via Groq • May produce inaccurate information</span>
//     <span>{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
//   </div>
// </div>

       
//       </div>
//     </div>
//   </div>
// );
return (
  <div className="h-screen flex flex-col bg-gray-900 text-white">
    {/* Header */}
    <div className="bg-black border-b border-gray-800 px-4 sm:px-6 py-4 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">ChatBot</h1>
          <p className="text-gray-400 text-sm">Powered by Groq • Lightning fast AI</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {messages.length > 0 && (
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Model: llama-3.3-70b</span>
          </div>
        )}
        <button
          onClick={clearChat}
          className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200 border border-gray-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-sm font-medium">New Chat</span>
        </button>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar - collapsible on mobile */}
      <div className="w-72 bg-black border-r border-gray-800 hidden lg:flex flex-shrink-0 p-6 flex-col space-y-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Model Info</h3>
        <div className="bg-gray-800 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-gray-400 text-sm">
            <span>Model:</span>
            <span className="text-white font-medium">Llama 3.3 70B</span>
          </div>
          <div className="flex justify-between text-gray-400 text-sm">
            <span>Provider:</span>
            <span className="text-white font-medium">Groq</span>
          </div>
          <div className="flex justify-between text-gray-400 text-sm">
            <span>Speed:</span>
            <span className="text-green-500 font-medium">Fast</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-black">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Chat with Llama 3.3 70B</h2>
                <p className="text-gray-400 text-sm sm:text-lg">
                  Experience lightning-fast responses from one of the most advanced AI models. Ask questions, generate content, and explore topics.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex max-w-[85%] space-x-3">
                  <div className="flex-1 min-w-0">
                    <div className={`px-4 py-3 rounded-2xl break-words ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-md shadow-md"
                        : "bg-gray-800 text-gray-300 border border-gray-700 rounded-bl-md shadow-sm"
                    }`}>
                      <div className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="flex-1 max-w-[85%]">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium">Llama 3.3 70B</span>
                  <span className="text-xs text-gray-400">Thinking...</span>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <span className="text-xs text-gray-400">Processing with Groq...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 bg-black p-3 sm:p-4 flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Llama 3.3 70B anything..."
            rows={1}
            disabled={loading}
            className="flex-1 w-full px-4 py-2 pr-12 border border-gray-700 rounded-3xl bg-gray-800 placeholder-gray-500 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 justify-center"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">Processing...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm">Send</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Info */}
        <div className="px-3 sm:px-4 py-1 text-gray-400 bg-black text-xs flex justify-between items-center">
          <span>Llama 3.3 70B via Groq • May produce inaccurate information</span>
          <span>{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  </div>
);

}