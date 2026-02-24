"""
Advanced PDF RAG System
Processes PDFs, creates embeddings, and enables semantic search
"""

import os
import pickle
from typing import List, Dict, Tuple
import numpy as np
from pathlib import Path

# PDF Processing
try:
    from PyPDF2 import PdfReader
except ImportError:
    print("Installing PyPDF2...")
    os.system("pip install pypdf2")
    from PyPDF2 import PdfReader

# Embeddings
try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("Installing sentence-transformers...")
    os.system("pip install sentence-transformers")
    from sentence_transformers import SentenceTransformer

# Vector Database
try:
    import faiss
except ImportError:
    print("Installing faiss-cpu...")
    os.system("pip install faiss-cpu")
    import faiss


class PDFRAGSystem:
    """Advanced RAG system for PDF question answering"""
    
    def __init__(self, pdf_folder: str = "pdfs", knowledge_base_folder: str = "knowledge_base"):
        self.pdf_folder = pdf_folder
        self.kb_folder = knowledge_base_folder
        self.embedding_model = None
        self.index = None
        self.chunks = []
        self.metadata = []
        
        # Create folders if they don't exist
        os.makedirs(pdf_folder, exist_ok=True)
        os.makedirs(knowledge_base_folder, exist_ok=True)
        
        print("🚀 Initializing PDF RAG System...")
        self._load_or_create_index()
    
    def _load_embedding_model(self):
        """Load sentence transformer model for embeddings"""
        if self.embedding_model is None:
            print("📥 Loading embedding model (this may take a moment)...")
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            print("✅ Embedding model loaded!")
        return self.embedding_model
    
    def extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from a PDF file"""
        try:
            reader = PdfReader(pdf_path)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            print(f"❌ Error reading {pdf_path}: {e}")
            return ""
    
    def chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
        """Split text into overlapping chunks"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = " ".join(words[i:i + chunk_size])
            if len(chunk.strip()) > 50:  # Only keep meaningful chunks
                chunks.append(chunk.strip())
        
        return chunks
    
    def process_pdfs(self) -> Tuple[List[str], List[Dict]]:
        """Process all PDFs in the folder"""
        print(f"\n📚 Processing PDFs from: {self.pdf_folder}")
        
        pdf_files = list(Path(self.pdf_folder).glob("*.pdf"))
        
        if not pdf_files:
            print(f"⚠️  No PDF files found in {self.pdf_folder}")
            print(f"   Please add your PDF files to the '{self.pdf_folder}' folder")
            return [], []
        
        all_chunks = []
        all_metadata = []
        
        for pdf_file in pdf_files:
            print(f"\n📄 Processing: {pdf_file.name}")
            
            # Extract text
            text = self.extract_text_from_pdf(str(pdf_file))
            
            if not text.strip():
                print(f"   ⚠️  No text extracted from {pdf_file.name}")
                continue
            
            # Chunk text
            chunks = self.chunk_text(text)
            print(f"   ✅ Extracted {len(chunks)} chunks")
            
            # Store chunks with metadata
            for i, chunk in enumerate(chunks):
                all_chunks.append(chunk)
                all_metadata.append({
                    'source': pdf_file.name,
                    'chunk_id': i,
                    'total_chunks': len(chunks)
                })
        
        print(f"\n✅ Total chunks processed: {len(all_chunks)}")
        return all_chunks, all_metadata
    
    def create_embeddings(self, chunks: List[str]) -> np.ndarray:
        """Create embeddings for text chunks"""
        print("\n🔄 Creating embeddings...")
        model = self._load_embedding_model()
        embeddings = model.encode(chunks, show_progress_bar=True)
        print("✅ Embeddings created!")
        return embeddings
    
    def create_faiss_index(self, embeddings: np.ndarray):
        """Create FAISS index for fast similarity search"""
        print("\n🔄 Creating FAISS index...")
        dimension = embeddings.shape[1]
        
        # Use IndexFlatL2 for exact search (good for small datasets)
        index = faiss.IndexFlatL2(dimension)
        index.add(embeddings.astype('float32'))
        
        print(f"✅ FAISS index created with {index.ntotal} vectors!")
        return index
    
    def save_index(self):
        """Save index, chunks, and metadata to disk"""
        print("\n💾 Saving knowledge base...")
        
        # Save FAISS index
        faiss.write_index(self.index, os.path.join(self.kb_folder, "faiss_index.bin"))
        
        # Save chunks and metadata
        with open(os.path.join(self.kb_folder, "chunks.pkl"), "wb") as f:
            pickle.dump(self.chunks, f)
        
        with open(os.path.join(self.kb_folder, "metadata.pkl"), "wb") as f:
            pickle.dump(self.metadata, f)
        
        print("✅ Knowledge base saved!")
    
    def load_index(self) -> bool:
        """Load existing index from disk"""
        index_path = os.path.join(self.kb_folder, "faiss_index.bin")
        chunks_path = os.path.join(self.kb_folder, "chunks.pkl")
        metadata_path = os.path.join(self.kb_folder, "metadata.pkl")
        
        if not all(os.path.exists(p) for p in [index_path, chunks_path, metadata_path]):
            return False
        
        try:
            print("📥 Loading existing knowledge base...")
            self.index = faiss.read_index(index_path)
            
            with open(chunks_path, "rb") as f:
                self.chunks = pickle.load(f)
            
            with open(metadata_path, "rb") as f:
                self.metadata = pickle.load(f)
            
            print(f"✅ Loaded {len(self.chunks)} chunks from knowledge base!")
            return True
        except Exception as e:
            print(f"❌ Error loading index: {e}")
            return False
    
    def _load_or_create_index(self):
        """Load existing index or create new one"""
        if self.load_index():
            # Load embedding model for queries
            self._load_embedding_model()
            return
        
        print("\n🔨 Creating new knowledge base...")
        
        # Process PDFs
        chunks, metadata = self.process_pdfs()
        
        if not chunks:
            print("\n⚠️  No content to index. Please add PDF files to the 'pdfs' folder.")
            return
        
        self.chunks = chunks
        self.metadata = metadata
        
        # Create embeddings
        embeddings = self.create_embeddings(chunks)
        
        # Create FAISS index
        self.index = self.create_faiss_index(embeddings)
        
        # Save everything
        self.save_index()
        
        print("\n🎉 Knowledge base created successfully!")
    
    def search(self, query: str, top_k: int = 3) -> List[Dict]:
        """Search for relevant chunks given a query"""
        if self.index is None or len(self.chunks) == 0:
            return []
        
        # Create query embedding
        model = self._load_embedding_model()
        query_embedding = model.encode([query])
        
        # Search in FAISS index
        distances, indices = self.index.search(query_embedding.astype('float32'), top_k)
        
        # Prepare results
        results = []
        for i, (dist, idx) in enumerate(zip(distances[0], indices[0])):
            if idx < len(self.chunks):
                results.append({
                    'rank': i + 1,
                    'text': self.chunks[idx],
                    'metadata': self.metadata[idx],
                    'similarity_score': float(1 / (1 + dist))  # Convert distance to similarity
                })
        
        return results
    
    def rebuild_index(self):
        """Rebuild the entire index from PDFs"""
        print("\n🔄 Rebuilding knowledge base...")
        
        # Remove old index
        for file in ['faiss_index.bin', 'chunks.pkl', 'metadata.pkl']:
            path = os.path.join(self.kb_folder, file)
            if os.path.exists(path):
                os.remove(path)
        
        # Recreate
        self._load_or_create_index()


def main():
    """Test the PDF RAG system"""
    print("=" * 60)
    print("PDF RAG System - Test")
    print("=" * 60)
    
    # Initialize system
    rag = PDFRAGSystem()
    
    # Test search
    if rag.index is not None:
        print("\n" + "=" * 60)
        print("Testing Search")
        print("=" * 60)
        
        test_query = "What is coal mining?"
        print(f"\nQuery: {test_query}")
        
        results = rag.search(test_query, top_k=3)
        
        if results:
            print(f"\nFound {len(results)} relevant passages:\n")
            for result in results:
                print(f"Rank {result['rank']} (Score: {result['similarity_score']:.3f})")
                print(f"Source: {result['metadata']['source']}")
                print(f"Text: {result['text'][:200]}...")
                print("-" * 60)
        else:
            print("No results found.")
    
    print("\n✅ Test complete!")


if __name__ == "__main__":
    main()
