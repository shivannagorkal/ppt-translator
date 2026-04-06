# PPT Translator AI

A modern web application built with React, Tailwind CSS, and Python (Flask) to translate PowerPoint (PPTX) presentations into different languages (like Kannada, Hindi, etc.) while perfectly preserving the original design, layout, fonts, colors, and images.

## Features
- **Drag & Drop UI:** Beautiful and modern frontend powered by React, Tailwind CSS, and Lucide Icons.
- **Perfect Preservation:** Uses `python-pptx` to traverse runs and paragraphs perfectly, maintaining exact fonts and layout.
- **Multi-language Support:** Powered by Google Translate API for quick translations.
- **Instant Download:** Re-generates the PPTX file instantly for download.

## Project Structure
```
ppt-translator/
├── backend/
│   ├── app.py             # Flask Server & Logic
│   └── requirements.txt   # Python Dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Frontend UI Code
│   │   ├── index.css      # Tailwind Import Styles
│   │   └── main.jsx       # React Entry point
│   ├── package.json       # Node Dependencies
│   ├── tailwind.config.js # Tailwind CSS Configuration
│   └── postcss.config.js  # PostCSS Configuration
└── README.md
```

## Setup Instructions for Beginners

### 1. Backend Setup (Flask & Python)
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment (Optional but Recommended):
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install the required Python libraries:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask server:
   ```bash
   python app.py
   ```
   *The backend will start running on `http://localhost:5000`.*

### 2. Frontend Setup (React & Vite)
1. Open a new, separate terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the necessary Node packages (React, Vite, Tailwind CSS, etc.):
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
   *The frontend will be accessible, usually at `http://localhost:5173`. Open this URL in your browser.*

### How It Works:
1. When you upload a `.pptx` file via the web app, it sends a POST request to `http://localhost:5000/api/translate` in the Backend.
2. The `app.py` script opens the PPTX using `python-pptx`, iterates over every shape, text frame, paragraph, and run.
3. The texts are translated using `googletrans` API in memory. 
4. The translated PPTX is returned back to the browser for your download, perfectly retaining its exact formatting.

## Notes on PDF Extraction:
While extracting text from PDF is straightforward with `pdfplumber`, perfectly replacing the original text while matching exactly the font, color, layout, and images without displacing them is highly complex for simple open-source community libraries. Modifying PDFs strictly as a "beginner" project usually results in clunky UI. Relying on `.pptx` allows for a 100% flawless format preservation which is the holy grail format for presentations!
