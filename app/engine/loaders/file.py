from llama_index.core.readers import SimpleDirectoryReader

def load_documents(data_dir="./data"):
    reader = SimpleDirectoryReader(data_dir, recursive=True)
    return reader.load_data()
