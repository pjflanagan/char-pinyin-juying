
import re
import pinyin as PinyinConv
from hanziconv import HanziConv

def getAllHanzi():
    hanzi = set()
    # Iterate through the primary Hanzi Unicode range
    for i in range(0x4E00, 0x9FFF + 1):
        hanzi.add(chr(i))

    # Iterate through a supplementary Hanzi Unicode range (Extension A)
    for i in range(0x3400, 0x4DBF + 1):
        hanzi.add(chr(i))
    
    return hanzi

REPLACE_PINYIN = [
    # [], can't find a first tone v
    ['v̀', 'ù'],
    ['v̌', 'ǔ'],
    ['v́', 'ú'],
    ['v', 'u'],
]


def getPinyin(char):
    pinyin = PinyinConv.get(char)
    for replacement in REPLACE_PINYIN:
        pinyin.replace(replacement[0], replacement[1])
    return pinyin

def getPinyinPhrase(phrase):
    pinyin = []
    for char in phrase:
        pinyin.append(getPinyin(char))
    separator = " "
    return separator.join(pinyin)

def getTonelessPinyin(char):
    return PinyinConv.get(char, format="strip").replace('v', 'u')

def getTone(char):
    pinyinNumerical = PinyinConv.get(char, format="numerical")
    numbers = re.findall(r'\d+', pinyinNumerical)
    return numbers[0] if numbers else None
