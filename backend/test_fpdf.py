
from fpdf import FPDF
import uharfbuzz
import urllib.request
import os

url = "https://raw.githubusercontent.com/sahibjotsaggu/Lohit-Kannada/master/Lohit-Kannada.ttf"
urllib.request.urlretrieve(url, "Lohit-Kannada.ttf")

pdf = FPDF()
pdf.add_page()
pdf.add_font("Kannada", fname="Lohit-Kannada.ttf")
pdf.set_font("Kannada", size=14)
pdf.set_text_shaping(True)
pdf.cell(0, 10, text="ಸ್ವಾಗತ", new_x="LMARGIN", new_y="NEXT") # "Welcome" encoded in Kannada
pdf.output("test_output.pdf")
print("PDF Generated! File size:", os.path.getsize("test_output.pdf"))
