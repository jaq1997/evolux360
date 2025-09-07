# backend/app/api/products.py
from fastapi import APIRouter, UploadFile, File
from app.services.excel_reader import process_excel

router = APIRouter()

@router.post("/import-products")
async def import_products(file: UploadFile = File(...)):
    result = await process_excel(file)
    return {"status": "ok", "imported": result}
