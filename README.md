# To run this code you need to install the following dependencies:
# pip install google-genai

import base64
import mimetypes
import os
from google import genai
from google.genai import types


def save_binary_file(file_name, data):
    f = open(file_name, "wb")
    f.write(data)
    f.close()
    print(f"File saved to to: {file_name}")


def generate():
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-2.5-flash-image-preview"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""create a website AI Virtual Shopping Assistant which have the features like A conversational interface that helps users shop based on personal preferences, budget, and style. The LLM recommends products by parsing catalogs and user input. It can also auto-generate cart suggestions in indian rupees and summaries and then connect it with an api and the website should accessible in every device .make the website looking good with a good frotend
generate code"""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""**1. Frontend (HTML, CSS, JavaScript):**

This will be a single-page application for simplicity. We'll use a clean, modern design.

**index.html:**

```html
<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>AI Shopping Assistant</title>
    <link rel=\"stylesheet\" href=\"style.css\">
    <link href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap\" rel=\"stylesheet\">
</head>
<body>
    <div class=\"container\">
        <header>
            <h1><span class=\"highlight\">Shop</span>Buddy AI</h1>
            <p>Your personal AI-powered shopping assistant.</p>
        </header>

        <div class=\"chat-window\">
            <div id=\"chat-messages\">
                <div class=\"message bot-message\">
                    <p>Hello! I'm ShopBuddy AI. How can I help you shop today?</p>
                </div>
            </div>
            <div class=\"chat-input\">
                <input type=\"text\" id=\"user-input\" placeholder=\"Type your message here...\">
                <button id=\"send-button\">Send</button>
            </div>
        </div>

        <div id=\"suggestions\" class=\"suggestions\">
            <h2>Recommended for You</h2>
            <div id=\"product-list\" class=\"product-list\">
                <!-- Product suggestions will be loaded here -->
            </div>
            <button id=\"add-to-cart-button\" class=\"action-button\" style=\"display: none;\">Add Selected to Cart</button>
        </div>

        <div id=\"cart-summary\" class=\"cart-summary\" style=\"display: none;\">
            <h2>Your Cart Summary</h2>
            <ul id=\"cart-items\">
                <!-- Cart items will be loaded here -->
            </ul>
            <p class=\"total\">Total: <span id=\"cart-total\">₹0.00</span></p>
            <button class=\"action-button\">Proceed to Checkout</button>
        </div>
    </div>

    <script src=\"script.js\"></script>
</body>
</html>
```

**style.css:**

```css
body {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f7f6;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.container {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 900px;
    padding: 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 25px;
}

header {
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

header h1 {
    font-size: 2.8em;
    color: #2c3e50;
    margin-bottom: 5px;
}

header h1 .highlight {
    color: #e74c3c; /* A distinct color for \"Shop\" */
}

header p {
    color: #7f8c8d;
    font-size: 1.1em;
}

.chat-window {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    height: 400px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #fdfdfd;
}

#chat-messages {
    flex-grow: 1;
    padding: 15px;
    overflow-y: auto;
    background-color: #fcfcfc;
}

.message {
    margin-bottom: 15px;
    display: flex;
    align-items: flex-start;
}

.bot-message {
    justify-content: flex-start;
}

.bot-message p {
    background-color: #e8f5e9;
    color: #2e7d32;
    border-radius: 18px 18px 18px 4px;
    padding: 12px 18px;
    max-width: 70%;
    line-height: 1.5;
}

.user-message {
    justify-content: flex-end;
}

.user-message p {
    background-color: #e3f2fd;
    color: #1976d2;
    border-radius: 18px 18px 4px 18px;
    padding: 12px 18px;
    max-width: 70%;
    line-height: 1.5;
}

.chat-input {
    display: flex;
    padding: 15px;
    border-top: 1px solid #e0e0e0;
    background-color: #ffffff;
}

#user-input {
    flex-grow: 1;
    padding: 12px 15px;
    border: 1px solid #ccc;
    border-radius: 25px;
    font-size: 1em;
    margin-right: 10px;
    transition: border-color 0.3s ease;
}

#user-input:focus {
    outline: none;
    border-color: #e74c3c;
}

#send-button {
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 25px;
    padding: 12px 25px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s ease;
}

#send-button:hover {
    background-color: #c0392b;
}

.suggestions, .cart-summary {
    background-color: #fdfdfd;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
}

.suggestions h2, .cart-summary h2 {
    color: #2c3e50;
    font-size: 1.8em;
    margin-top: 0;
    margin-bottom: 20px;
    text-align: center;
}

.product-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.product-card {
    background-color: #ffffff;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.product-card:hover {
    transform: translateY(-5px);
}

.product-card img {
    max-width: 100%;
    height: 150px;
    object-fit: contain;
    border-radius: 8px;
    margin-bottom: 10px;
}

.product-card h3 {
    font-size: 1.2em;
    color: #34495e;
    margin-bottom: 8px;
    flex-grow: 1;
}

.product-card p {
    font-size: 1.1em;
    color: #e74c3c;
    font-weight: bold;
    margin-bottom: 10px;
}

.product-card .add-checkbox {
    margin-top: 10px;
    font-size: 0.9em;
    color: #555;
}

.action-button {
    display: block;
    width: fit-content;
    margin: 20px auto 0;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 25px;
    padding: 12px 30px;
    cursor: pointer;
    font-size: 1.1em;
    transition: background-color 0.3s ease;
}

.action-button:hover {
    background-color: #218838;
}

.cart-summary ul {
    list-style: none;
    padding: 0;
    margin-bottom: 20px;
    border-top: 1px solid #eee;
    padding-top: 15px;
}

.cart-summary li {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f5f5f5;
    font-size: 1.05em;
    color: #555;
}

.cart-summary li:last-child {
    border-bottom: none;
}

.cart-summary .total {
    font-size: 1.5em;
    font-weight: bold;
    text-align: right;
    color: #e74c3c;
    margin-top: 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 20px;
        width: 95%;
    }

    header h1 {
        font-size: 2.2em;
    }

    header p {
        font-size: 1em;
    }

    .chat-window {
        height: 350px;
    }

    .product-list {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }

    .message p {
        max-width: 85%;
        padding: 10px 15px;
    }

    #user-input {
        padding: 10px 12px;
    }

    #send-button {
        padding: 10px 20px;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 15px;
    }

    header h1 {
        font-size: 1.8em;
    }

    header p {
        font-size: 0.9em;
    }

    .chat-window {
        height: 300px;
    }

    .product-list {
        grid-template-columns: 1fr;
    }

    .chat-input {
        flex-direction: column;
        gap: 10px;
    }

    #user-input {
        margin-right: 0;
    }

    #send-button {
        width: 100%;
    }
}
```

**script.js:**

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const productList = document.getElementById('product-list');
    const addToCartButton = document.getElementById('add-to-cart-button');
    const cartSummaryDiv = document.getElementById('cart-summary');
    const cartItemsList = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');

    let conversationHistory = [];
    let availableProducts = []; // To store products fetched from API/catalog
    let selectedForCart = new Map(); // Map of product ID to product object

    // Function to add a message to the chat window
    function addMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }

    // Function to simulate sending message to backend and getting a response
    async function sendMessageToAI(message) {
        addMessage('user', message);
        conversationHistory.push({ role: 'user', content: message });

        try {
            // In a real application, this would be an API call to your LLM backend
            // For now, let's simulate a response and product suggestions
            const simulatedResponse = await simulateAIResponse(message);
            addMessage('bot', simulatedResponse.text);

            if (simulatedResponse.products && simulatedResponse.products.length > 0) {
                displayProductSuggestions(simulatedResponse.products);
                addToCartButton.style.display = 'block';
            } else {
                productList.innerHTML = '';
                addToCartButton.style.display = 'none';
            }

            if (simulatedResponse.cartSummary) {
                displayCartSummary(simulatedResponse.cartSummary);
            } else {
                cartSummaryDiv.style.display = 'none';
            }

            conversationHistory.push({ role: 'bot', content: simulatedResponse.text });

        } catch (error) {
            console.error('Error communicating with AI:', error);
            addMessage('bot', 'Oops! Something went wrong. Please try again.');
        }
    }

    // Simulate AI response and product catalog parsing
    async function simulateAIResponse(message) {
        // This would be your actual LLM integration
        // For demonstration, we'll use simple keyword matching

        let botResponse = {
            text: \"I'm still learning! How can I assist you further?\",
            products: [],
            cartSummary: null
        };

        const lowerCaseMessage = message.toLowerCase();

        // Simulate product catalog (replace with actual API fetch)
        const catalog = [
            { id: 'p001', name: 'Premium Wireless Headphones', price: 7999.00, imageUrl: 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Headphones' },
            { id: 'p002', name: 'Ergonomic Office Chair', price: 12499.00, imageUrl: 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Office+Chair' },
            { id: 'p003', name: 'Smart Fitness Tracker', price: 3499.00, imageUrl: 'https://via.placeholder.com/150/3357FF/FFFFFF?text=Fitness+Tracker' },
            { id: 'p004', name: 'Organic Green Tea (500g)', price: 499.00, imageUrl: 'https://via.placeholder.com/150/FF33CC/FFFFFF?text=Green+Tea' },
            { id: 'p005', name: 'Portable Bluetooth Speaker', price: 2999.00, imageUrl: 'https://via.placeholder.com/150/FFFF33/000000?text=Speaker' },
            { id: 'p006', name: 'Cotton T-shirt (Men, M)', price: 799.00, imageUrl: 'https://via.placeholder.com/150/8A2BE2/FFFFFF?text=T-shirt' }
        ];
        availableProducts = catalog; // Update global available products

        if (lowerCaseMessage.includes('headphones') || lowerCaseMessage.includes('audio')) {
            botResponse.text = \"Certainly! Here are some excellent headphones for you:\";
            botResponse.products = catalog.filter(p => p.name.toLowerCase().includes('headphones') || p.name.toLowerCase().includes('speaker'));
        } else if (lowerCaseMessage.includes('chair') || lowerCaseMessage.includes('office')) {
            botResponse.text = \"Looking for an office chair? Check these out:\";
            botResponse.products = catalog.filter(p => p.name.toLowerCase().includes('chair'));
        } else if (lowerCaseMessage.includes('fitness') || lowerCaseMessage.includes('health')) {
            botResponse.text = \"Stay fit with these health gadgets:\";
            botResponse.products = catalog.filter(p => p.name.toLowerCase().includes('fitness'));
        } else if (lowerCaseMessage.includes('tea') || lowerCaseMessage.includes('drink')) {
            botResponse.text = \"Here's some organic tea you might like:\";
            botResponse.products = catalog.filter(p => p.name.toLowerCase().includes('tea'));
        } else if (lowerCaseMessage.includes('clothes') || lowerCaseMessage.includes('t-shirt')) {
            botResponse.text = \"Fashion forward! Take a look at these:\";
            botResponse.products = catalog.filter(p => p.name.toLowerCase().includes('t-shirt'));
        } else if (lowerCaseMessage.includes('budget') || lowerCaseMessage.includes('cheap')) {
            botResponse.text = \"I can help with that! What's your budget range?\";
            botResponse.products = catalog.filter(p => p.price < 5000);
        } else if (lowerCaseMessage.includes('show cart') || lowerCaseMessage.includes('my cart')) {
            botResponse.text = \"Here's what you have in your cart right now:\";
            botResponse.cartSummary = Array.from(selectedForCart.values());
        } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
            botResponse.text = \"Hi there! What are you looking to buy today?\";
        } else if (lowerCaseMessage.includes('thank you') || lowerCaseMessage.includes('thanks')) {
            botResponse.text = \"You're welcome! Let me know if you need anything else.\";
        } else if (lowerCaseMessage.includes('nothing') || lowerCaseMessage.includes('no')) {
            botResponse.text = \"Okay, just let me know if you change your mind!\";
            botResponse.products = [];
        }
        else {
            botResponse.text = \"I'm not sure I understood that. Can you tell me what type of product you're interested in, or give me more details about your preferences?\";
            botResponse.products = catalog; // Suggest some general products
        }

        // Simulate network delay
        return new Promise(resolve => setTimeout(() => resolve(botResponse), 800));
    }


    function displayProductSuggestions(products) {
        productList.innerHTML = ''; // Clear previous suggestions
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src=\"${product.imageUrl}\" alt=\"${product.name}\">
                <h3>${product.name}</h3>
                <p>₹${product.price.toLocaleString('en-IN')}</p>
                <label class=\"add-checkbox\">
                    <input type=\"checkbox\" data-product-id=\"${product.id}\"> Add to Cart
                </label>
            `;
            productList.appendChild(productCard);

            // Set checkbox state based on selectedForCart
            const checkbox = productCard.querySelector(`input[data-product-id=\"${product.id}\"]`);
            if (selectedForCart.has(product.id)) {
                checkbox.checked = true;
            }

            checkbox.addEventListener('change', (event) => {
                if (event.target.checked) {
                    selectedForCart.set(product.id, product);
                } else {
                    selectedForCart.delete(product.id);
                }
            });
        });
    }

    function displayCartSummary(cartItems) {
        cartItemsList.innerHTML = '';
        let total = 0;

        if (cartItems.length === 0) {
            cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
        } else {
            cartItems.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${item.name}</span>
                    <span>₹${item.price.toLocaleString('en-IN')}</span>
                `;
                cartItemsList.appendChild(listItem);
                total += item.price;
            });
        }
        cartTotalSpan.textContent = `₹${total.toLocaleString('en-IN')}`;
        cartSummaryDiv.style.display = 'block';
    }


    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            sendMessageToAI(message);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });

    addToCartButton.addEventListener('click', () => {
        // This would normally involve another API call to \"add to cart\" on the backend
        // For this demo, we've already updated selectedForCart
        if (selectedForCart.size > 0) {
            addMessage('bot', `Great! I've added the selected items to your cart. You can say \"show cart\" to see your summary.`);
            displayCartSummary(Array.from(selectedForCart.values()));
        } else {
            addMessage('bot', 'No items were selected to add to the cart.');
        }
    });
});
```

**2. Backend (Python with Flask - API):**

This backend will serve as your API endpoint for the frontend. It will interact with a hypothetical LLM and product catalog.

**Install Flask:**
`pip install Flask`

**app.py:**

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for frontend communication

# --- Simulate Product Catalog (In a real app, this would be a database) ---
PRODUCT_CATALOG = [
    {\"id\": \"p001\", \"name\": \"Premium Wireless Headphones\", \"price\": 7999.00, \"imageUrl\": \"https://via.placeholder.com/150/FF5733/FFFFFF?text=Headphones\"},
    {\"id\": \"p002\", \"name\": \"Ergonomic Office Chair\", \"price\": 12499.00, \"imageUrl\": \"https://via.placeholder.com/150/33FF57/FFFFFF?text=Office+Chair\"},
    {\"id\": \"p003\", \"name\": \"Smart Fitness Tracker\", \"price\": 3499.00, \"imageUrl\": \"https://via.placeholder.com/150/3357FF/FFFFFF?text=Fitness+Tracker\"},
    {\"id\": \"p004\", \"name\": \"Organic Green Tea (500g)\", \"price\": 499.00, \"imageUrl\": \"https://via.placeholder.com/150/FF33CC/FFFFFF?text=Green+Tea\"},
    {\"id\": \"p005\", \"name\": \"Portable Bluetooth Speaker\", \"price\": 2999.00, \"imageUrl\": \"https://via.placeholder.com/150/FFFF33/000000?text=Speaker\"},
    {\"id\": \"p006\", \"name\": \"Cotton T-shirt (Men, M)\", \"price\": 799.00, \"imageUrl\": \"https://via.placeholder.com/150/8A2BE2/FFFFFF?text=T-shirt\"},
    {\"id\": \"p007\", \"name\": \"Novelty Coffee Mug\", \"price\": 350.00, \"imageUrl\": \"https://via.placeholder.com/150/FFA500/FFFFFF?text=Mug\"},
    {\"id\": \"p008\", \"name\": \"Digital Drawing Tablet\", \"price\": 8999.00, \"imageUrl\": \"https://via.placeholder.com/150/DA70D6/FFFFFF?text=Tablet\"},
    {\"id\": \"p009\", \"name\": \"Set of Gourmet Chocolates\", \"price\": 1200.00, \"imageUrl\": \"https://via.placeholder.com/150/8B4513/FFFFFF?text=Chocolates\"}
]

# --- Simulate User's Cart (In a real app, this would be session-based or database-backed) ---
user_cart = []

# --- LLM Integration (Conceptual - replace with actual LLM API calls) ---
def get_llm_response(user_message, conversation_history):
    \"\"\"
    This function would send the user_message and conversation_history to your LLM API.
    The LLM would then:
    1. Understand user intent (e.g., \"looking for headphones\", \"show me cheap options\", \"add to cart\").
    2. Parse preferences (budget, style, keywords).
    3. Query the product catalog based on parsed preferences.
    4. Generate a conversational response.
    5. Optionally, return product recommendations and/or cart updates.
    \"\"\"
    lower_case_message = user_message.lower()
    response_text = \"I'm not sure I understood that. Can you tell me what you're looking for?\"
    recommended_products = []
    current_cart_summary = []

    # Simple keyword-based logic for demo purposes
    if \"hello\" in lower_case_message or \"hi\" in lower_case_message:
        response_text = \"Hello there! How can I assist you with your shopping today?\"
        recommended_products = PRODUCT_CATALOG[:3] # Show some initial suggestions
    elif \"headphones\" in lower_case_message or \"audio\" in lower_case_message:
        response_text = \"Certainly! Here are some great audio options:\"
        recommended_products = [p for p in PRODUCT_CATALOG if \"headphone\" in p['name'].lower() or \"speaker\" in p['name'].lower()]
    elif \"chair\" in lower_case_message or \"office\" in lower_case_message:
        response_text = \"Looking for an office chair? We have these:\"
        recommended_products = [p for p in PRODUCT_CATALOG if \"chair\" in p['name'].lower()]
    elif \"cheap\" in lower_case_message or \"budget\" in lower_case_message:
        try:
            # Simple regex to extract a number for budget
            import re
            match = re.search(r'under (\\d+)|less than (\\d+)|(\\d+) rupees', lower_case_message)
            budget = float(match.group(1) or match.group(2) or match.group(3)) if match else 5000
            response_text = f\"Okay, here are some items under ₹{budget:,.2f}:\"
            recommended_products = [p for p in PRODUCT_CATALOG if p['price'] <= budget]
        except (AttributeError, TypeError):
            response_text = \"What's your budget? I can show you items under a certain price.\"
            recommended_products = [p for p in PRODUCT_CATALOG if p['price'] < 2000] # Default cheap
    elif \"cart\" in lower_case_message and (\"show\" in lower_case_message or \"my\" in lower_case_message):
        response_text = \"Here's what's currently in your cart:\"
        current_cart_summary = list(user_cart) # Return a copy
    elif \"add to cart\" in lower_case_message:
        response_text = \"Please specify which product you'd like to add. For example, 'add p001 to cart'.\"
        # This part would be more complex with LLM identifying specific products
    elif \"clear cart\" in lower_case_message:
        user_cart.clear()
        response_text = \"Your cart has been cleared.\"
        current_cart_summary = []
    elif \"recommend\" in lower_case_message or \"suggestions\" in lower_case_message:
        response_text = \"Based on popular choices, you might like these:\"
        recommended_products = PRODUCT_CATALOG[-3:] # Simple recommendation logic
    else:
        response_text = \"I'm still learning! Could you be more specific about what you're looking for, or ask to 'show cart'?\"
        recommended_products = PRODUCT_CATALOG # Default to showing everything

    return {
        \"text\": response_text,
        \"products\": recommended_products,
        \"cart_summary\": current_cart_summary
    }

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    conversation_history = data.get('history', []) # Frontend will send history

    if not user_message:
        return jsonify({\"error\": \"No message provided\"}), 400

    # Get response from LLM (simulated here)
    llm_response = get_llm_response(user_message, conversation_history)

    return jsonify({
        \"bot_message\": llm_response[\"text\"],
        \"suggestions\": llm_response[\"products\"],
        \"cart_summary\": llm_response[\"cart_summary\"]
    })

@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    data = request.json
    product_ids = data.get('product_ids', [])

    added_items = []
    for p_id in product_ids:
        product = next((item for item in PRODUCT_CATALOG if item[\"id\"] == p_id), None)
        if product and product not in user_cart:
            user_cart.append(product)
            added_items.append(product)

    return jsonify({
        \"message\": f\"Added {len(added_items)} items to cart.\",
        \"cart_contents\": user_cart,
        \"total_items\": len(user_cart)
    })

@app.route('/get_cart', methods=['GET'])
def get_cart():
    return jsonify({
        \"cart_contents\": user_cart,
        \"total_items\": len(user_cart),
        \"cart_total\": sum(item['price'] for item in user_cart)
    })


if __name__ == '__main__':
    app.run(debug=True)
```

**How to Run This:**

1.  **Save the files:**
    *   Create a folder (e.g., `ai_shopping_assistant`).
    *   Inside it, create `index.html`, `style.css`, `script.js`.
    *   Also inside the folder, create `app.py`.

2.  **Run the Backend:**
    *   Open your terminal or command prompt.
    *   Navigate to the `ai_shopping_assistant` folder.
    *   Run: `python app.py`
    *   You should see output indicating the Flask server is running, usually on `http://127.0.0.1:5000/`.

3.  **Open the Frontend:**
    *   Simply open the `index.html` file in your web browser. You can usually do this by double-clicking it.

**Explanation and Features:**

*   **Conversational Interface:** The chat window allows users to type queries in natural language.
*   **LLM (Simulated):** The `get_llm_response` function in `app.py` is where your actual Large Language Model (e.g., OpenAI's GPT, Google's Gemini, or a fine-tuned open-source model) would be integrated.
    *   It would receive the `user_message` and `conversation_history`.
    *   It would use its natural language understanding to extract intent, preferences (like \"budget,\" \"style,\" \"color,\" \"brand\").
    *   It would then search your `PRODUCT_CATALOG` (or a real database) based on these extracted preferences.
    *   Finally, it would generate a friendly, helpful text response and a list of relevant `recommended_products`.
*   **Product Catalog Parsing:** In the `get_llm_response`, we're simulating this by keyword matching and filtering `PRODUCT_CATALOG`. A real LLM would do this much more intelligently.
*   **Auto-generate Cart Suggestions & Summaries (INR):**
    *   When products are suggested, checkboxes allow users to select them.
    *   The \"Add Selected to Cart\" button (in `script.js`) updates a `selectedForCart` Map.
    *   When the user asks to \"show cart,\" the AI (simulated) returns the current cart items, and the frontend displays a summary with the total in Indian Rupees (₹).
*   **Connect with API:** The frontend `script.js` uses `fetch` to send messages to the Flask backend's `/chat` endpoint and receive responses. It also has a conceptual `/add_to_cart` endpoint.
*   **Responsive Design:** The `style.css` uses `@media` queries to ensure the website looks good and is usable on various devices (desktops, tablets, mobile phones).
*   **Good Frontend Look:** The CSS provides a clean, modern, and inviting user interface with appropriate colors, fonts, and spacing.
    *   `ShopBuddy AI` with a highlighted word gives it a catchy brand name.
    *   Chat bubbles are styled differently for user and bot.
    *   Product cards are well-structured with images, names, and prices.
    *   Cart summary is clear and easy to read.

**To integrate a real LLM (e.g., OpenAI GPT-4):**

1.  **Install the LLM Library:** `pip install openai` (or the equivalent for your chosen LLM).
2.  **Get API Key:** Obtain an API key from your LLM provider.
3.  **Modify `app.py`:**
    *   Import the LLM client.
    *"""),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""INSERT_INPUT_HERE"""),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_modalities=[
            "IMAGE",
            "TEXT",
        ],
    )

    file_index = 0
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        if (
            chunk.candidates is None
            or chunk.candidates[0].content is None
            or chunk.candidates[0].content.parts is None
        ):
            continue
        if chunk.candidates[0].content.parts[0].inline_data and chunk.candidates[0].content.parts[0].inline_data.data:
            file_name = f"ENTER_FILE_NAME_{file_index}"
            file_index += 1
            inline_data = chunk.candidates[0].content.parts[0].inline_data
            data_buffer = inline_data.data
            file_extension = mimetypes.guess_extension(inline_data.mime_type)
            save_binary_file(f"{file_name}{file_extension}", data_buffer)
        else:
            print(chunk.text)

if __name__ == "__main__":
    generate()
