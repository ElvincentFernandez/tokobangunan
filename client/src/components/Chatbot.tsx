// src/components/Chatbot.tsx
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import { useEffect, useState, useRef } from "react";
import { generateContent } from "../lib/gemini";
import { useProducts } from "../hooks/useProducts";
import {
  FiTrash2,
  FiMinimize2,
  FiMessageCircle,
  FiShoppingBag,
  FiTag,
  FiPackage,
  FiSearch,
  FiStar,
  FiX
} from "react-icons/fi";

// ===== tipe pesan chat =====
interface ChatMessage {
  type: "user" | "bot";
  message: string;
  timestamp?: Date;
}

// Tipe untuk data yang disimpan di localStorage
interface StoredChatMessage {
  type: "user" | "bot";
  message: string;
  timestamp?: string;
}

// ===== quick replies utama =====
const QUICK_REPLIES = [
  {
    text: "Produk termurah",
    icon: <FiTag />,
    category: "price"
  },
  {
    text: "Produk diskon",
    icon: <FiShoppingBag />,
    category: "discount"
  },
  {
    text: "Stok habis",
    icon: <FiPackage />,
    category: "stock"
  },
  {
    text: "Cari Bata Hebel",
    icon: <FiSearch />,
    category: "search"
  },
  {
    text: "Rekomendasi",
    icon: <FiStar />,
    category: "recommendation"
  },
  {
    text: "Kategori besi",
    icon: <FiPackage />,
    category: "category"
  },
];

interface ChatbotProps {
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Gunakan context produk
  const {
    products,
    searchProducts,
    getDiscountedProducts,
    getOutOfStockProducts,
    getProductsByCategory
  } = useProducts();

  /* ---------- Auto scroll ke bawah ---------- */
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------- load history dari localStorage ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("duraChatHistory");
    if (saved) {
      try {
        const parsed: StoredChatMessage[] = JSON.parse(saved);
        // Convert string timestamps back to Date objects
        const historyWithDates: ChatMessage[] = parsed.map((msg: StoredChatMessage) => ({
          type: msg.type,
          message: msg.message,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
        }));
        setChatHistory(historyWithDates);
      } catch {
        console.warn("Gagal parse chat history");
        setChatHistory([
          {
            type: "bot",
            message: "Halo! Saya DuraBot, asisten toko bangunan. Ada yang bisa saya bantu?",
            timestamp: new Date()
          },
        ]);
      }
    } else {
      setChatHistory([
        {
          type: "bot",
          message: "Halo! Saya DuraBot, asisten toko bangunan. Ada yang bisa saya bantu?",
          timestamp: new Date()
        },
      ]);
    }
  }, []);

  /* ---------- simpan history ---------- */
  useEffect(() => {
    const storedHistory: StoredChatMessage[] = chatHistory.map(msg => ({
      type: msg.type,
      message: msg.message,
      timestamp: msg.timestamp?.toISOString()
    }));
    localStorage.setItem("duraChatHistory", JSON.stringify(storedHistory));
  }, [chatHistory]);

  /* ---------- fungsi reset ---------- */
  const resetChat = () => {
    setChatHistory([
      {
        type: "bot",
        message: "Chat telah di-reset. Ada yang bisa dibantu lagi?",
        timestamp: new Date()
      },
    ]);
    setUserInput("");
    setShowQuickReplies(true);
  };

  /* ---------- format waktu ---------- */
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /* ---------- format produk untuk prompt ---------- */
  const formatProductsForPrompt = (): string => {
    if (products.length === 0) {
      return "Tidak ada data produk yang tersedia.";
    }

    return products.map(product =>
      `- ${product.name}: Rp ${product.price.toLocaleString()} | Stok: ${product.stock} ${product.oldPrice ? `| Diskon: ${product.badge?.text || ''}` : ''
      }${product.category ? ` | Kategori: ${product.category}` : ''}`
    ).join('\n');
  };

  /* ---------- logika balasan bot ---------- */
  const generateBotReply = async (text: string): Promise<string> => {
    const lower = text.toLowerCase().trim();

    // 1) Quick Replies / aturan manual berdasarkan data produk
    if (products.length > 0) {
      if (lower.includes("murah") || lower.includes("termurah")) {
        const sorted = [...products].sort((a, b) => a.price - b.price);
        const cheapest = sorted.slice(0, 3); // Tampilkan 3 termurah
        return `🏷️ **3 Produk Termurah:**\n\n${cheapest.map((p, i) =>
          `${i + 1}. **${p.name}**\n   💵 Rp ${p.price.toLocaleString()}\n   📦 Stok: ${p.stock}${p.oldPrice ? `\n   💰 ~~Rp ${p.oldPrice?.toLocaleString()}~~` : ''
          }${p.category ? `\n   📁 ${p.category}` : ''}`
        ).join("\n\n")}`;
      }

      if (lower.includes("diskon") || lower.includes("promo")) {
        const disc = getDiscountedProducts();
        if (disc.length === 0) return "Maaf, saat ini tidak ada produk diskon.";
        return (
          "🎯 **Produk dengan diskon:**\n\n" +
          disc.map((p) =>
            `• **${p.name}**\n  💵 Rp ${p.price.toLocaleString()}\n  ~~Rp ${p.oldPrice?.toLocaleString()}~~ (${p.badge?.text || 'Diskon'})\n  📦 Stok: ${p.stock}`
          ).join("\n\n")
        );
      }

      if (lower.includes("stok habis") || lower.includes("kosong")) {
        const out = getOutOfStockProducts();
        if (out.length === 0) return "✅ Semua produk masih tersedia stoknya.";
        return (
          "❌ **Produk stok habis:**\n\n" +
          out.map((p) => `• ${p.name}`).join("\n")
        );
      }

      if (lower.startsWith("cari") || lower.includes("search")) {
        const keyword = lower.replace(/^cari|search/i, "").trim();
        if (!keyword) return "Kata kunci apa yang ingin Anda cari?";
        const found = searchProducts(keyword);
        if (found.length === 0) return `❌ Tidak ditemukan produk dengan kata kunci '${keyword}'.`;
        return (
          `🔍 **Hasil pencarian '${keyword}':**\n\n` +
          found
            .map((p) =>
              `• **${p.name}**\n  💵 Rp ${p.price.toLocaleString()}\n  📦 Stok: ${p.stock}${p.oldPrice ? `\n  💰 ~~Rp ${p.oldPrice?.toLocaleString()}~~` : ''
              }`
            )
            .join("\n\n")
        );
      }

      if (lower.includes("kategori")) {
        const categories = ["bata", "besi", "semen", "kayu"];
        const foundCategory = categories.find(cat => lower.includes(cat));
        if (foundCategory) {
          const categoryProducts = getProductsByCategory(foundCategory);
          if (categoryProducts.length === 0) return `Tidak ada produk dalam kategori ${foundCategory}.`;
          return (
            `📁 **Produk kategori ${foundCategory}:**\n\n` +
            categoryProducts
              .map((p) =>
                `• **${p.name}**\n  💵 Rp ${p.price.toLocaleString()}\n  📦 Stok: ${p.stock}${p.oldPrice ? `\n  💰 ~~Rp ${p.oldPrice?.toLocaleString()}~~` : ''
                }`
              )
              .join("\n\n")
          );
        } else {
          return "Kategori yang tersedia: bata, besi, semen, kayu. Coba tanya 'produk kategori besi'";
        }
      }

      if (lower.includes("rekomendasi") || lower.includes("sarankan")) {
        const available = products.filter(p => p.stock > 0);
        const recommended = available.slice(0, 3);
        return (
          "⭐ **Rekomendasi produk untuk Anda:**\n\n" +
          recommended
            .map((p, i) =>
              `${i + 1}. **${p.name}**\n   💵 Rp ${p.price.toLocaleString()}\n   📦 Stok: ${p.stock}${p.oldPrice ? `\n   💰 ~~Rp ${p.oldPrice?.toLocaleString()}~~` : ''
              }${p.category ? `\n   📁 ${p.category}` : ''}`
            )
            .join("\n\n")
        );
      }
    }

    // 2) Gunakan Gemini AI untuk pertanyaan umum
    try {
      setIsTyping(true);

      const productData = products.length > 0 ?
        `\n\n**Data Produk Toko:**\n${formatProductsForPrompt()}` :
        "\n\n**Catatan:** Data produk saat ini tidak tersedia.";

      const prompt = `
Anda adalah **DuraBot**, asisten AI untuk toko material bangunan "DuraBata". 
Jawab dengan ramah, informatif, dan singkat (maksimal 100 kata).

**Aturan:**
- Untuk pertanyaan tentang produk, gunakan data produk yang tersedia
- Jika tidak tahu, jangan mengarang jawaban
- Fokus pada material bangunan
- Gunakan emoji untuk membuat jawaban lebih menarik
- Format jawaban dengan rapi menggunakan markdown sederhana

**Pertanyaan User:** "${text}"
${productData}

**Jawablah dengan format yang rapi dan mudah dibaca:**
`;

      const response = await generateContent(prompt);
      return response || "Maaf, saya tidak bisa memberikan jawaban saat ini. Silakan coba lagi.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Maaf, layanan AI sedang tidak tersedia. Silakan gunakan quick replies atau hubungi admin.";
    } finally {
      setIsTyping(false);
    }
  };

  /* ---------- kirim pesan ---------- */
  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      type: "user",
      message: messageText,
      timestamp: new Date()
    };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setUserInput("");
    setShowQuickReplies(false);

    setIsTyping(true);
    try {
      const botReply = await generateBotReply(messageText);
      const botMsg: ChatMessage = {
        type: "bot",
        message: botReply,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      const errorMsg: ChatMessage = {
        type: "bot",
        message: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  /* ---------- handle quick reply click ---------- */
  const handleQuickReplyClick = (reply: string) => {
    sendMessage(reply);
  };

  /* ---------- toggle minimize ---------- */
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Jika diminiatur, tampilkan tombol kecil
  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-6 z-50">
        <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-full shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-300 animate-bounce">
          <button
            className="text-white"
            onClick={toggleMinimize}
          >
            <FiMessageCircle size={24} />
          </button>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 px-4 py-3 text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-semibold">DuraBot Assistant</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleMinimize}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Minimize"
          >
            <FiMinimize2 size={16} />
          </button>
          <button
            onClick={resetChat}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Reset Chat"
          >
            <FiTrash2 size={16} />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Close"
          >
            <FiX size={16} />
          </button>
        </div>
      </div>

      {/* Chat Messages - Menggunakan @chatscope/chat-ui-kit-react */}
      <div className="flex-1 overflow-hidden">
        <MainContainer>
          <ChatContainer>
            <MessageList
              className="p-2"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator
                    content={
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">DuraBot sedang mengetik...</span>
                      </div>
                    }
                  />
                ) : null
              }
            >
              {chatHistory.map((msg, i) => (
                <Message
                  key={i}
                  model={{
                    message: msg.message,
                    sender: msg.type === "user" ? "user" : "DuraBot",
                    direction: msg.type === "user" ? "outgoing" : "incoming",
                    position: "single",
                  }}
                  className="mb-2"
                >
                  {msg.timestamp && (
                    <Message.Footer
                      sender={msg.type === "user" ? "You" : "DuraBot"}
                      sentTime={formatTime(msg.timestamp)}
                    />
                  )}
                </Message>
              ))}
              <div ref={messagesEndRef} />
            </MessageList>
          </ChatContainer>
        </MainContainer>
      </div>

      {/* Quick Replies */}
      {showQuickReplies && chatHistory.length <= 2 && (
        <div className="px-3 pt-2 pb-1 bg-gray-50 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Pertanyaan Cepat:</span>
            <button
              onClick={() => setShowQuickReplies(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {QUICK_REPLIES.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickReplyClick(q.text)}
                className="text-xs px-3 py-2 bg-white border border-gray-300 rounded-full hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200 flex items-center shadow-sm"
              >
                <span className="flex items-center gap-1">
                  {q.icon}
                  {q.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input - Menggunakan @chatscope/chat-ui-kit-react */}
      <div className="border-t border-gray-200 p-3 bg-white">
        <div className="flex space-x-2">
          <MessageInput
            placeholder="Ketik pesan Anda..."
            value={userInput}
            onChange={(val: string) => setUserInput(val)}
            onSend={sendMessage}
            attachButton={false}
            autoFocus={true}
            className="flex-1"
          />
        </div>
      </div>

      <style>{`
        .cs-message--outgoing .cs-message__content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          border-radius: 18px 18px 6px 18px !important;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }
        
        .cs-message--incoming .cs-message__content {
          background: #f8fafc !important;
          color: #2d3748 !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 18px 18px 18px 6px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .cs-message-input__content-editor-wrapper {
          background: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
        }
        
        .cs-message-input__content-editor {
          background: transparent !important;
          padding: 8px 12px !important;
        }
        
        .cs-message__footer {
          font-size: 0.7rem !important;
          opacity: 0.7;
          margin-top: 4px;
        }
        
        .cs-typing-indicator {
          background: transparent !important;
        }
        
        .cs-main-container {
          border: none !important;
        }
        
        .cs-chat-container {
          background: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;