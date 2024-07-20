import os
from llama_index.core.settings import Settings
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.llms.ollama import Ollama

def init_settings():
    base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    
    Settings.embed_model = OllamaEmbedding(
        base_url=base_url,
        model_name=os.getenv("EMBEDDING_MODEL", "llama2"),
    )
    Settings.llm = Ollama(
        base_url=base_url,
        model=os.getenv("MODEL", "llama2"),
        request_timeout=float(os.getenv("OLLAMA_REQUEST_TIMEOUT", 120.0))
    )

    Settings.chunk_size = int(os.getenv("CHUNK_SIZE", "1024"))
    Settings.chunk_overlap = int(os.getenv("CHUNK_OVERLAP", "20"))
