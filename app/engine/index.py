from llama_index.core import VectorStoreIndex
from llama_index.core.storage import StorageContext
from llama_index.vector_stores import ChromaVectorStore
import chromadb

def get_or_create_index(persist_dir="./storage"):
    chroma_client = chromadb.PersistentClient(path=persist_dir)
    chroma_collection = chroma_client.get_or_create_collection("llama_tree")
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    
    return VectorStoreIndex.from_vector_store(
        vector_store,
        storage_context=storage_context,
    )
