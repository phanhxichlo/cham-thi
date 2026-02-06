from fastapi import APIRouter, UploadFile, File
from core.image_processing import process_image
from core.grading_logic import grade_answers
from utils.excel_export import export_excel

router = APIRouter(prefix="/grade", tags=["Grading"])

@router.post("/")
async def grade_exam(file: UploadFile = File(...)):
    image_bytes = await file.read()
    detected_answers = process_image(image_bytes)
    result = grade_answers(detected_answers)
    return result

@router.post("/export")
async def export(file: UploadFile = File(...)):
    image_bytes = await file.read()
    detected_answers = process_image(image_bytes)
    result = grade_answers(detected_answers)
    excel_path = export_excel(result)
    return {"excel": excel_path}
