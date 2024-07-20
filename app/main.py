from fastapi import FastAPI, File, UploadFile
from app.settings import init_settings
from app.engine.index import get_or_create_index
from app.engine.loaders.file import load_documents
from app.agents.query_agent import create_query_agent

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    init_settings()
    app.state.index = get_or_create_index()
    app.state.query_agent = create_query_agent(app.state.index)

@app.post("/upload-document/")
async def upload_document(file: UploadFile = File(...)):
    content = await file.read()
    with open(f"data/{file.filename}", "wb") as f:
        f.write(content)
    documents = load_documents()
    app.state.index.refresh_ref_docs(documents)
    return {"message": "Document uploaded and processed successfully"}

@app.post("/query/")
async def query(question: str):
    response = app.state.query_agent.chat(question)
    return {"response": str(response)}

@app.post("/generate-quiz/")
async def generate_quiz(num_questions: int = 3):
    prompt = f"Generate a quiz with {num_questions} multiple-choice questions based on the indexed documents. Format the output as a JSON array."
    response = app.state.query_agent.chat(prompt)
    return {"quiz": response}
