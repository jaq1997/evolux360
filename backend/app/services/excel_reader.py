# backend/app/services/excel_reader.py
import pandas as pd
from io import BytesIO

async def process_excel(file):
    contents = await file.read()
    df = pd.read_excel(BytesIO(contents))

    # Exemplo de validação
    imported = []
    for _, row in df.iterrows():
        sku = row.get("SKU")
        name = row.get("Nome")
        price = row.get("Preço")
        if sku and name and price:
            imported.append({"sku": sku, "name": name, "price": price})
    
    return imported
