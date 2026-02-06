from fastapi import FastAPI
from api.grading import router as grading_router

app = FastAPI()

app.include_router(grading_router)
