

from fpdf import FPDF

pdf = FPDF('L', 'in', 'legal')
pdf.add_font('noto', '', 'scripts/font/NotoSansTC-Regular.ttf', uni=True)
pdf.set_font('noto', '', 22)

pdf.add_page()
pdf.multi_cell(2.2, 2.833, "我們回家所以我們可以吃晚飯", 1, 'C') 
pdf.output('tuto1.pdf', 'F')

