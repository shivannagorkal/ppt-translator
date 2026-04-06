from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from pptx import Presentation
from deep_translator import GoogleTranslator
import os
import io

app = Flask(__name__)
# Enable CORS so the React frontend can communicate with the Flask backend
CORS(app)

def translate_text(text, target_lang='kn'):
    """
    Translates text to the target language using deep_translator.
    Returns the original text if translation fails.
    """
    try:
        if not text or not text.strip():
            return text
        translation = GoogleTranslator(source='auto', target=target_lang).translate(text)
        return translation
    except Exception as e:
        print(f"Translation Error: {e}")
        return text

@app.route('/api/translate', methods=['POST'])
def handle_translation():
    """
    Endpoint handles the uploaded PPTX file, translates its text content, 
    and returns a downloadable file preserving layout and images.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
        
    file = request.files['file']
    target_lang = request.form.get('target_language', 'kn')
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    try:
        # Check if file is PPTX
        if file.filename.lower().endswith('.pptx'):
            # Load presentation directly from memory (bytes)
            file_bytes = io.BytesIO(file.read())
            prs = Presentation(file_bytes)
            
            # Loop through all slides and shapes, perfectly preserving everything
            for slide in prs.slides:
                for shape in slide.shapes:
                    if not shape.has_text_frame:
                        continue
                    text_frame = shape.text_frame
                    
                    # Iterate precisely through paragraphs and runs to preserve specific font styling
                    for paragraph in text_frame.paragraphs:
                        for run in paragraph.runs:
                            original_text = run.text
                            # Only translate non-empty text
                            if original_text and original_text.strip():
                                translated = translate_text(original_text, target_lang)
                                run.text = translated
            
            # Save translated file back into memory without hitting the disk
            output_bytes = io.BytesIO()
            prs.save(output_bytes)
            output_bytes.seek(0)
            
            # Return the file as a downloadable attachment
            return send_file(
                output_bytes,
                as_attachment=True,
                download_name=f"translated_{file.filename}",
                mimetype='application/vnd.openxmlformats-officedocument.presentationml.presentation'
            )
            
        elif file.filename.lower().endswith('.pdf'):
            # PDFs are notoriously difficult to modify inplace while preserving full design.
            return jsonify({'error': 'For beginner implementation, PDF exact layout replacement is limited. Please use PPTX for perfect results.'}), 400
            
        else:
            return jsonify({'error': 'Unsupported file type. Please upload a PPTX file.'}), 400
            
    except Exception as e:
        print(f"Error processing file: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run the Flask app on localhost, port 5000
    app.run(debug=True, port=5000)
