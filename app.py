#!/usr/bin/env python3

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from chainSetup import get_retrieval_chain

# Initialize FastAPI app
app = FastAPI()

# Retrieve the chain
retrieval_chain = get_retrieval_chain()

# Define input model for request body
class QueryRequest(BaseModel):
    input: str

# FastAPI endpoint
@app.post("/query")
async def query_llm(request: QueryRequest):
    try:
        # Invoke the retrieval chain with the user's input
        response = retrieval_chain.invoke({"input": request.input})
        return {"answer": response['answer']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
