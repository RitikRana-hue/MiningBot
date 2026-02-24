#!/usr/bin/env python3
"""
Test script for the PDF RAG Mining Chatbot System
All answers come from your PDFs only
"""

import requests
import json

BASE_URL = "http://localhost:5001"

def test_status():
    """Test the status endpoint"""
    print("=" * 70)
    print("Testing Status Endpoint")
    print("=" * 70)
    
    response = requests.get(f"{BASE_URL}/")
    data = response.json()
    
    print(f"✓ Server is running")
    print(f"✓ Gemini AI: {'Available' if data['gemini_available'] else 'Not Available'}")
    print(f"✓ PDF RAG: {'Available' if data['pdf_rag']['available'] else 'Not Available'}")
    if data['pdf_rag']['available']:
        print(f"  - Chunks indexed: {data['pdf_rag']['chunks_indexed']}")
        print(f"  - PDFs processed: {data['pdf_rag']['pdfs_processed']}")
    print(f"✓ Strategy: {data['strategy']}")
    print()

def test_question(question, description):
    """Test a question"""
    print("=" * 70)
    print(f"Test: {description}")
    print("=" * 70)
    print(f"Question: {question}")
    print()
    
    response = requests.post(
        f"{BASE_URL}/api/chat",
        json={"question": question},
        headers={"Content-Type": "application/json"}
    )
    
    data = response.json()
    
    print(f"Source: {data['source']}")
    print(f"Confidence: {data['confidence']:.2f}")
    if 'pdf_sources' in data:
        print(f"PDF Sources: {', '.join(data['pdf_sources'])}")
    print(f"\nResponse:\n{data['response'][:500]}...")
    print()

def main():
    print("\n" + "=" * 70)
    print("PDF RAG Mining Chatbot - System Test")
    print("All answers come from YOUR PDFs")
    print("=" * 70 + "\n")
    
    try:
        # Test 1: Status
        test_status()
        
        # Test 2: PDF-specific question
        test_question(
            "What is spontaneous combustion in coal mining?",
            "PDF-specific question"
        )
        
        # Test 3: General mining question
        test_question(
            "What is gold mining?",
            "General mining question (should find relevant content in PDFs)"
        )
        
        # Test 4: Complex question
        test_question(
            "What are the best practices for preventing spontaneous combustion?",
            "Complex question requiring analysis"
        )
        
        # Test 5: Question not in PDFs
        test_question(
            "What is diamond mining?",
            "Question that may not be in PDFs"
        )
        
        print("=" * 70)
        print("✓ All tests completed!")
        print("=" * 70)
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        print("Make sure the server is running: python3 main.py")

if __name__ == "__main__":
    main()
