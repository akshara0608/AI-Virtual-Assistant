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
            text: "I'm still learning! How can I assist you further?",
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
            botResponse.text = "Certainly! Here are some excellent headphones for you:";
            botResponse.products = catalog.filter(p => p.name.toLowerCase().includes('headphones') || p.name.toLowerCase().includes('speaker'));
        } else if (lowerCaseMessage.includes('chair') || lowerCaseMessage.includes('office')) {
            botResponse.text = "Looking for an office chair? Check these out:";
            botResponse.products = catalog.filter(p => p.name.toLowerCase().includes('chair'));
        } else if (lowerCaseMessage.includes('fitness') || lowerCaseMessage.includes('health')) {
            botResponse.text = "Stay fit with these health gadgets:";
            botResponse.products = catalog.filter(p => p.name.toLowerCase().includes('fitness'));
        } else if (lowerCaseMessage.includes('tea') || lowerCaseMessage.includes('drink')) {
            botResponse.text = "Here's some organic tea you might like:";
            botResponse.products = catalog.filter(p => p.name.toLowerCase().includes('tea'));
        } else if (lowerCaseMessage.includes('clothes') || lowerCaseMessage.includes('t-shirt')) {
            botResponse.text = "Fashion forward! Take a look at these:";
            botResponse.products = catalog.filter(p => p.name.toLowerCase().includes('t-shirt'));
        } else if (lowerCaseMessage.includes('budget') || lowerCaseMessage.includes('cheap')) {
            botResponse.text = "I can help with that! What's your budget range?";
            botResponse.products = catalog.filter(p => p.price < 5000);
        } else if (lowerCaseMessage.includes('show cart') || lowerCaseMessage.includes('my cart')) {
            botResponse.text = "Here's what you have in your cart right now:";
            botResponse.cartSummary = Array.from(selectedForCart.values());
        } else if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
            botResponse.text = "Hi there! What are you looking to buy today?";
        } else if (lowerCaseMessage.includes('thank you') || lowerCaseMessage.includes('thanks')) {
            botResponse.text = "You're welcome! Let me know if you need anything else.";
        } else if (lowerCaseMessage.includes('nothing') || lowerCaseMessage.includes('no')) {
            botResponse.text = "Okay, just let me know if you change your mind!";
            botResponse.products = [];
        }
        else {
            botResponse.text = "I'm not sure I understood that. Can you tell me what type of product you're interested in, or give me more details about your preferences?";
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
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>₹${product.price.toLocaleString('en-IN')}</p>
                <label class="add-checkbox">
                    <input type="checkbox" data-product-id="${product.id}"> Add to Cart
                </label>
            `;
            productList.appendChild(productCard);

            // Set checkbox state based on selectedForCart
            const checkbox = productCard.querySelector(`input[data-product-id="${product.id}"]`);
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
        // This would normally involve another API call to "add to cart" on the backend
        // For this demo, we've already updated selectedForCart
        if (selectedForCart.size > 0) {
            addMessage('bot', `Great! I've added the selected items to your cart. You can say "show cart" to see your summary.`);
            displayCartSummary(Array.from(selectedForCart.values()));
        } else {
            addMessage('bot', 'No items were selected to add to the cart.');
        }
    });
});