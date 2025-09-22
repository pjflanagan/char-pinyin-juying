import re
import unicodedata
import pinyin as PinyinConv
from hanziconv import HanziConv
from googletrans import Translator

REPLACE_PINYIN = [
    # can't find a first tone v
    ['v̀', 'ù'],
    ['v̌', 'ǔ'],
    ['v́', 'ú'],
    ['v', 'u'],
]

IGNORE_CHARACTERS = [
    '了', '出'
]

class Hanzi:
    def getAll():
        hanzi = set()
        # Iterate through the primary Hanzi Unicode range
        for i in range(0x4E00, 0x9FFF + 1):
            hanzi.add(chr(i))

        # Iterate through a supplementary Hanzi Unicode range (Extension A)
        for i in range(0x3400, 0x4DBF + 1):
            hanzi.add(chr(i))
        
        return hanzi

    def getPinyin(char):
        pinyin = PinyinConv.get(char)
        for replacement in REPLACE_PINYIN:
            pinyin.replace(replacement[0], replacement[1])
        return pinyin
    
    def getTonelessPinyin(char):
        return PinyinConv.get(char, format="strip").replace('v', 'u')

    def getTone(char):
        pinyinNumerical = PinyinConv.get(char, format="numerical")
        numbers = re.findall(r'\d+', pinyinNumerical)
        return numbers[0] if numbers else None
    
    def getTraditional(char):
        if char in IGNORE_CHARACTERS:
            return char
        else:
            return HanziConv.toTraditional(char)
    
class Pinyin:
    # TODO: return [pinyin, Array<number>]
    def stripTones(pinyin):
        nfkd_form = unicodedata.normalize('NFKD', pinyin)
        return "".join([c for c in nfkd_form if not unicodedata.combining(c)])

class Zhuyin:
    def fromPinyin(pinyin):
        toneless = Pinyin.stripTones(pinyin)
        # TODO: work backward through each pinyin block
        # TODO: get zhuyin separated by spaces
        return ''


translator = Translator(service_urls=[
      'translate.googleapis.com'
    ])

class Phrase:
    # TODO: remove this, translate should return
    # pinyin and english
    def getPinyin(phrase):
        pinyin = []
        for char in phrase:
            pinyin.append(Hanzi.getPinyin(char))
        separator = " "
        return separator.join(pinyin)

    def getTraditional(phrase):
        traditional = []
        for char in phrase:
            traditional.append(Hanzi.getTraditional(char))
        separator = ""
        return separator.join(traditional)

    # TODO: this should use google
    async def translate(phrase):
        return await translator.translate(phrase)

