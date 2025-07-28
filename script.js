const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const darkToggle = document.getElementById("darkModeToggle");

// 🔠 Keywords per category
const keywords = {
  skincare: [
    "dry skin", "acne", "moisturizer", "wrinkles", "serum", "oily", "sensitive skin", "redness",
    "cleansing", "cleanser", "anti-aging", "blackheads", "sunscreen", "spf", "hydration", "toner",
    "night cream", "blemishes", "pores", "vitamin c", "niacinamide", "retinol", "exfoliator", "brightening"
  ],
  haircare: [
    "damaged hair", "split ends", "frizz", "shampoo", "conditioner", "oily scalp", "dry scalp",
    "hair fall", "breakage", "curly hair", "colored hair", "thin hair", "volume", "keratin",
    "heat protection", "shine", "leave-in", "hair oil", "dandruff", "hydrating", "detangling"
  ],
  makeup: [
    "foundation", "mascara", "lipstick", "concealer", "makeup", "eyeliner", "blush", "highlighter",
    "primer", "brow", "eye shadow", "setting spray", "coverage", "matte", "glow", "natural look",
    "lip gloss", "lip balm", "contour", "bronzer", "smudge proof", "makeup base", "sensitive skin makeup"
  ],
  explain: [
    "what is", "explain", "difference between", "meaning of", "how to use", "what does", "compare", "benefits of"
  ]
};

// 📘 Educational explanations
const explanations = {
  "niacinamide": "Niacinamide is a form of Vitamin B3 that helps reduce pores, improve skin texture, and brighten complexion.",
  "retinol": "Retinol is a Vitamin A derivative that boosts collagen production and accelerates skin cell turnover, great for anti-aging.",
  "serum": "A serum is a lightweight skincare product with high concentrations of active ingredients, applied before moisturizer.",
  "moisturizer": "Moisturizer helps lock in hydration and protect the skin barrier after applying treatments like serum.",
  "spf": "SPF stands for Sun Protection Factor and protects your skin from harmful UV rays that cause sunburn and aging.",
  "foundation": "Foundation is makeup that evens your skin tone and provides a smooth base for other products.",
  "concealer": "Concealer is used to hide blemishes, dark circles, or imperfections and is usually more pigmented than foundation.",
  "shampoo": "Shampoo cleanses the hair and scalp by removing dirt, oil, and product buildup.",
  "conditioner": "Conditioner moisturizes and softens hair, making it more manageable after shampooing.",
  "primer": "Primer is applied before foundation to smooth skin and help makeup stay in place longer.",
  "eye cream": "Eye cream targets fine lines, puffiness, and dark circles around the delicate under-eye area."
};

// 🛍️ Sample product data
const productData = {
  skincare: [
    { name: "Revitalift Serum", img: "https://i.imgur.com/tRwBiXx.png" },
    { name: "Hydra Genius Moisturizer", img: "https://i.imgur.com/jYDr3Mm.png" }
  ],
  haircare: [
    { name: "Elvive Total Repair", img: "https://i.imgur.com/CU7Gb4O.png" },
    { name: "Dream Lengths Shampoo", img: "https://i.imgur.com/e8RlNKN.png" }
  ],
  makeup: [
    { name: "Infallible Foundation", img: "https://i.imgur.com/Vw3CI8j.png" },
    { name: "Voluminous Mascara", img: "https://i.imgur.com/9KEFx2u.png" }
  ]
};

// 💬 Add message to chat
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  saveHistory();
}

// 🖼️ Show product cards
function addProductCards(category) {
  const products = productData[category];
  products.forEach(prod => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}" />
      <div><strong>${prod.name}</strong><br>L'Oréal ${category}</div>
    `;
    chatWindow.appendChild(card);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  });
  saveHistory();
}

// 🧠 Smart reply logic
function getResponse(input) {
  const inputLower = input.toLowerCase();

  // 1. Explanation matching
  if (keywords.explain.some(phrase => inputLower.includes(phrase))) {
    for (let concept in explanations) {
      if (inputLower.includes(concept)) {
        return explanations[concept];
      }
    }
    return "I can explain ingredients like 'niacinamide', 'retinol', or 'spf'. Try asking about one of those!";
  }

  // 2. Multi-category product matching
  let matchedCategories = [];
  for (let category of ["skincare", "haircare", "makeup"]) {
    if (keywords[category].some(word => inputLower.includes(word))) {
      matchedCategories.push(category);
    }
  }

  if (matchedCategories.length > 0) {
    matchedCategories.forEach((category, i) => {
      setTimeout(() => {
        addMessage(`Here are some recommendations for ${category}:`, "bot");
        addProductCards(category);
      }, 500 + i * 500);
    });
    return `Let me find some great options for: ${matchedCategories.join(", ")}`;
  }

  // 3. Fallback
  return `I can help with product advice or explain ingredients. Try asking:
- "What is retinol?"
- "Best serum for dry skin?"
- "Compare serum and moisturizer."`;
}

// 💾 Local storage
function saveHistory() {
  localStorage.setItem("chatHistory", chatWindow.innerHTML);
}

function loadHistory() {
  const saved = localStorage.getItem("chatHistory");
  if (saved) chatWindow.innerHTML = saved;
}

// 🚀 Event listeners
sendBtn.addEventListener("click", () => {
  const input = userInput.value.trim();
  if (!input) return;

  addMessage(input, "user");
  const response = getResponse(input);
  setTimeout(() => addMessage(response, "bot"), 400);
  userInput.value = "";
});

userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendBtn.click();
});

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

window.addEventListener("DOMContentLoaded", () => {
  loadHistory();
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }

  // 💡 Suggested question buttons
  document.querySelectorAll(".suggestion").forEach(button => {
    button.addEventListener("click", () => {
      userInput.value = button.textContent;
      sendBtn.click();
    });
  });
});
