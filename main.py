from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Shopping Assistant Backend is running 🎉"}

@app.get("/recommend")
def recommend(item: str):
    return {"item": item, "suggestion": "This is a suggested product!"}
