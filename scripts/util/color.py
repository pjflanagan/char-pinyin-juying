
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
  'none'
]

def getRandomColor():
  return random.choice(PALLET)

def isValidColor(color):
  return color in PALLET
