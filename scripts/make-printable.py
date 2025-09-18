
import math
from fpdf import FPDF
from util.file import loadCsv

deck_name = 'basic-flashcards'

# ---------------------------------------------------------
# CONST ---------------------------------------------------
# ---------------------------------------------------------

PAGE_WIDTH = 8.5
PAGE_HEIGHT = 11

CARD_COLUMNS = 3
CARD_ROWS = 5

CARD_WIDTH = PAGE_WIDTH / CARD_COLUMNS
CARD_HEIGHT = PAGE_HEIGHT / CARD_ROWS

# ---------------------------------------------------------
# PAGE MODEL ----------------------------------------------
# ---------------------------------------------------------

# returns: { phrase, pinyin, english }
# def makeCard():

def getEmptyPage():
  return [[None for _ in range(CARD_COLUMNS)] for _ in range(CARD_ROWS)]

# Front   Back
# 0 1 2 | 2 1 0
# 3 4 5 | 5 4 3
# orders a set of 15 or less cards into 5 rows of 3
# returns the front page and the back page
def makePagePair(cards):
  front = getEmptyPage()
  back = getEmptyPage()
  for index, card in enumerate(cards):
    row = math.floor(index / CARD_COLUMNS)
    frontCol = index % CARD_COLUMNS
    backCol = CARD_COLUMNS - 1 - frontCol
    front[row][frontCol] = card
    back[row][backCol] = card
  return [front, back]

# ---------------------------------------------------------
# DRAW ----------------------------------------------------
# ---------------------------------------------------------

PADDING = 0.2

# x, y are the top left corner
def drawFrontCard(pdf, text, x, y):
  marginTop = 0.2 if len(text) <= 5 else 0.45
  pdf.set_xy(x + PADDING, y + CARD_HEIGHT / 2 - marginTop)
  pdf.set_font('noto', '', 32)
  pdf.multi_cell(CARD_WIDTH - PADDING, 0.6, text, 0, 'C') 
  return

def drawBackCard(pdf, card, x, y):
  # pdf.multi_cell(2.2, 2.833, "definition", 1, 'C') 
  # pdf.set_font('noto', '', 22)
  return

def drawPageBorders(pdf):
  pdf.set_line_width(0.008)
  pdf.set_draw_color(r=200, g=200, b=200)
  # lines up and down
  col = 1
  while col < CARD_COLUMNS:
    pdf.line(x1=col*CARD_WIDTH, y1=0, x2=col*CARD_WIDTH, y2=PAGE_HEIGHT)
    col += 1
  # lines across
  row = 1
  while row < CARD_ROWS:
    pdf.line(x1=0, y1=row*CARD_HEIGHT, x2=PAGE_WIDTH, y2=row*CARD_HEIGHT)
    row += 1

def drawPage(pdf, pageModel, isFront=True):
  pdf.add_page()
  drawPageBorders(pdf)

  row = 0
  col = 0
  while row < len(pageModel):
    while col < len(pageModel[row]):
      card = pageModel[row][col]
      if (card != None):
        if (isFront):
          drawFrontCard(pdf, card[0], col * CARD_WIDTH, row * CARD_HEIGHT)
        else:
          # TODO: draw the back card
          drawFrontCard(pdf, card[1], col * CARD_WIDTH, row * CARD_HEIGHT)
      col += 1
    col = 0
    row += 1


if __name__ == "__main__":
  pdf = FPDF('P', 'in', 'Letter')
  pdf.add_font('noto', '', 'scripts/font/NotoSansTC-Regular.ttf', uni=True)
  pdf.set_auto_page_break(False)

  flashcards = loadCsv('data/' + deck_name)

  pageCardSet = []
  for entry in flashcards:
    pageCardSet.append(entry)
    if (len(pageCardSet) == CARD_COLUMNS * CARD_ROWS):
      [front, back] = makePagePair(pageCardSet)
      drawPage(pdf, front)
      drawPage(pdf, back, False)
      pageCardSet = []

  pdf.output('print/' + deck_name + '.pdf', 'F')


