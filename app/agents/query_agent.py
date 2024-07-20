from llama_index.core.agent import ReActAgent
from llama_index.core.tools import QueryEngineTool, ToolMetadata

def create_query_agent(index):
    query_engine = index.as_query_engine()
    query_tool = QueryEngineTool(
        query_engine=query_engine,
        metadata=ToolMetadata(
            name="context_data",
            description="Use this tool to answer questions about the provided context.",
        ),
    )
    return ReActAgent.from_tools([query_tool], verbose=True)
