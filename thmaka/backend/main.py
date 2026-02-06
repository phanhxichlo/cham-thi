from fastapi import FastAPI
from api.grading import router as grading_router

app = FastAPI(title="Web Chấm Trắc Nghiệm")

app.include_router(grading_router)

# chạy:
# uvicorn main:app --reload
