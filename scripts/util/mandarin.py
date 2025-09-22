import re
import unicodedata
import pinyin as PinyinConv
from hanziconv import HanziConv
from googletrans import Translator
from util.map import findInMap
from util.file import loadCsv


HANZI_TO_ENGLISH_MAP = loadCsv('data/maps/Hanzi-English')
PINYIN_TONELESS_TO_ZHUYIN_MAP = loadCsv('data/maps/PinyinToneless-Zhuyin')

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
        
    # find the english definition of a single char
    def getEnglish(char):
        return findInMap(HANZI_TO_ENGLISH_MAP, char)
    
    def getZhuyin(char):
        toneless = Hanzi.getTonelessPinyin(char)
        return findInMap(PINYIN_TONELESS_TO_ZHUYIN_MAP, toneless)
        
    
class Pinyin:
    def stripTones(pinyin):
        nfkd_form = unicodedata.normalize('NFKD', pinyin)
        return "".join([c for c in nfkd_form if not unicodedata.combining(c)])

translator = Translator(service_urls=[
      'translate.googleapis.com'
    ])

class Phrase:
    def getTraditional(phrase):
        traditional = []
        for char in phrase:
            traditional.append(Hanzi.getTraditional(char))
        separator = ""
        return separator.join(traditional)

    # TODO: this should use google
    async def translate(phrase):
        if len(phrase) == 1:
            english = Hanzi.getEnglish(phrase)
            pinyin = Hanzi.getPinyin(phrase)
            return {
                "english": english,
                "pinyin": pinyin
            }
        return await translator.translate(phrase)

