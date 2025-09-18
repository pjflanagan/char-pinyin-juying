
import math
from fpdf import FPDF

deck_name = 'basic-flashcards'

PAGE_WIDTH = 8.5
PAGE_HEIGHT = 11

CARD_COLUMNS = 3
CARD_ROWS = 5

CARD_WIDTH = PAGE_WIDTH / CARD_COLUMNS
CARD_HEIGHT = PAGE_HEIGHT / CARD_ROWS

def addPage(pdf):
  pdf.add_page()
  pdf.set_line_width(0.008)
  pdf.set_draw_color(r=200, g=200, b=200)
  # lines up and down
  col = 1
  while col < CARD_COLUMNS:
    pdf.line(x1=col*CARD_WIDTH, y1=0, x2=col*CARD_WIDTH, y2=PAGE_HEIGHT)
  # lines across
  row = 1
  while row < CARD_ROWS:
    pdf.line(x1=0, y1=row*CARD_HEIGHT, x2=PAGE_WIDTH, y2=row*CARD_HEIGHT)
    row += 1

# returns: { phrase, pinyin, english }
# def makeCard():


def makeEmptyPage():
  return [["" for _ in range(CARD_ROWS)] for _ in range(CARD_COLUMNS)]

# Front   Back
# 0 1 2 | 2 1 0
# 3 4 5 | 5 4 3
# orders a set of 15 or less cards into 5 rows of 3
# returns the front page and the back page
def orderCards(cards):
  front = makeEmptyPage()
  back = makeEmptyPage()
  for index, card in enumerate(cards):
    row = math.floor(index / CARD_COLUMNS)
    frontCol = index % CARD_COLUMNS
    backCol = CARD_COLUMNS - 1 - frontCol
    front[row][frontCol] = card
    back[row][backCol]
  return [front, back]

def testIndex(index):
  row = math.floor(index / CARD_COLUMNS)
  frontCol = index % CARD_COLUMNS
  backCol = CARD_COLUMNS - 1 - frontCol
  print(index, row, frontCol, backCol)


pdf = FPDF('P', 'in', 'Letter')
pdf.add_font('noto', '', 'scripts/font/NotoSansTC-Regular.ttf', uni=True)
pdf.set_font('noto', '', 22)

# pdf.add_page()
# pdf.multi_cell(2.2, 2.833, "我們回家所以我們可以吃晚飯", 1, 'C') 
addPage(pdf)

pdf.output('print/' + deck_name + '.pdf', 'F')


