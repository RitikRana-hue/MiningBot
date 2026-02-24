# PDFs Folder

## 📁 Store Your PDF Documents Here

Place your 5 PDF files in this folder.

### Example:
```
pdfs/
├── mining_safety_manual.pdf
├── equipment_guide.pdf
├── operations_handbook.pdf
├── geology_report.pdf
└── regulations_document.pdf
```

### After Adding PDFs:

Run this command to process them:
```bash
python pdf_processor.py
```

This will:
1. Extract text from all PDFs
2. Create embeddings
3. Build searchable index
4. Save to `knowledge_base/` folder

### Supported Formats:
- ✅ PDF files (.pdf)
- ✅ Any size
- ✅ Scanned or text-based PDFs

### Notes:
- You can add more PDFs anytime
- Run `python pdf_processor.py` again to rebuild the index
- The system will process all PDFs in this folder
