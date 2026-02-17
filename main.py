"""
Mining Chatbot - A conversational assistant for mining-related queries.

This chatbot can help with:
- Cryptocurrency mining information
- Mining hardware recommendations
- Mining pool suggestions
- Profitability calculations
- General mining concepts
"""

import re
from typing import Optional


class MiningChatbot:
    """A chatbot specialized in mining-related topics."""

    def __init__(self):
        self.context = {}
        self.responses = {
            "greeting": [
                "Hello! I'm your mining assistant. How can I help you today?",
                "Hi there! Ready to chat about mining. What would you like to know?",
            ],
            "farewell": [
                "Goodbye! Happy mining!",
                "See you later! Good luck with your mining operations!",
            ],
            "unknown": [
                "I'm not sure about that. Could you ask something about mining?",
                "I specialize in mining topics. Could you rephrase your question?",
            ],
        }
        self.knowledge_base = {
            "bitcoin": "Bitcoin (BTC) is the first and most well-known cryptocurrency. It uses SHA-256 algorithm for mining.",
            "ethereum": "Ethereum transitioned to Proof of Stake in 2022, so traditional GPU mining is no longer possible for ETH.",
            "gpu": "GPU mining uses graphics cards to solve cryptographic puzzles. Popular GPUs include NVIDIA RTX series and AMD RX series.",
            "asic": "ASIC (Application-Specific Integrated Circuit) miners are specialized hardware designed for specific mining algorithms.",
            "pool": "Mining pools allow miners to combine their computational power and share rewards proportionally.",
            "hashrate": "Hashrate measures the computational power used in mining, typically measured in H/s, MH/s, GH/s, or TH/s.",
            "difficulty": "Mining difficulty adjusts based on network hashrate to maintain consistent block times.",
            "profitability": "Mining profitability depends on hardware costs, electricity rates, coin price, and network difficulty.",
            "wallet": "A cryptocurrency wallet is needed to receive mining rewards. Use hardware wallets for better security.",
        }

    def get_response(self, user_input: str) -> str:
        """Generate a response based on user input."""
        user_input = user_input.lower().strip()

        # Check for greetings
        if self._is_greeting(user_input):
            return self.responses["greeting"][0]

        # Check for farewells
        if self._is_farewell(user_input):
            return self.responses["farewell"][0]

        # Search knowledge base
        response = self._search_knowledge_base(user_input)
        if response:
            return response

        # Default response
        return self.responses["unknown"][0]

    def _is_greeting(self, text: str) -> bool:
        """Check if the input is a greeting."""
        greetings = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon"]
        return any(greeting in text for greeting in greetings)

    def _is_farewell(self, text: str) -> bool:
        """Check if the input is a farewell."""
        farewells = ["bye", "goodbye", "see you", "farewell", "quit", "exit"]
        return any(farewell in text for farewell in farewells)

    def _search_knowledge_base(self, text: str) -> Optional[str]:
        """Search the knowledge base for relevant information."""
        for keyword, info in self.knowledge_base.items():
            if keyword in text:
                return info
        return None


def main():
    """Main function to run the chatbot."""
    chatbot = MiningChatbot()

    print("=" * 50)
    print("Welcome to the Mining Chatbot!")
    print("Ask me anything about cryptocurrency mining.")
    print("Type 'quit' or 'exit' to end the conversation.")
    print("=" * 50)
    print()

    while True:
        try:
            user_input = input("You: ").strip()

            if not user_input:
                continue

            if user_input.lower() in ["quit", "exit"]:
                print(f"Bot: {chatbot.responses['farewell'][0]}")
                break

            response = chatbot.get_response(user_input)
            print(f"Bot: {response}")
            print()

        except KeyboardInterrupt:
            print(f"\nBot: {chatbot.responses['farewell'][0]}")
            break
        except EOFError:
            break


if __name__ == "__main__":
    main()
