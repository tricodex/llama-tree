from llama_index.vector_stores import MilvusVectorStore
from llama_index.core import VectorStoreIndex
from pymilvus import connections, Collection

def get_or_create_index(collection_name="llama_tree"):
    connections.connect(
        alias="default",
        host=os.getenv("MILVUS_HOST", "localhost"),
        port=os.getenv("MILVUS_PORT", "19530")
    )
    
    if Collection.has_collection(collection_name):
        collection = Collection(collection_name)
        collection.load()
    else:
        # You may need to define the schema here if it doesn't exist
        # This is a simplified example
        from pymilvus import FieldSchema, CollectionSchema
        from pymilvus.enums import DataType

        fields = [
            FieldSchema(name="id", dtype=DataType.INT64, is_primary=True, auto_id=True),
            FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=65535),
            FieldSchema(name="vector", dtype=DataType.FLOAT_VECTOR, dim=384)  # Adjust dim as needed
        ]
        schema = CollectionSchema(fields, "Llama Tree collection")
        collection = Collection(collection_name, schema)

    vector_store = MilvusVectorStore(collection=collection)
    return VectorStoreIndex.from_vector_store(vector_store)
