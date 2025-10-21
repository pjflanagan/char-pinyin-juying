
import random

PALLET = [
  'red',
  'dark-red',
  'brown', 
  'orange',
  'yellow',
  'lime',
  'green',
  'teal',
  'cyan',
  'light-blue',
  'blue',
  'dark-blue',
  'pink',
  'hot-pink',
  'purple',
  'white',
  'light-grey',
  'grey',
  'dark-grey',
  'black',
]

def getRandomColor():
  return random.choice(PALLET)

def isValidColor(color):
  return color in PALLET

# CONSIDER:
# ChatGPT prompt to get colors
# 告訴我什麼顏色最能描述<phrase>，用一個英文單字回答
