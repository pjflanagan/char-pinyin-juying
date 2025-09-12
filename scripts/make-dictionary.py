
from unidecode import unidecode
import re
import pinyin
from hanziconv import HanziConv
from util.loadCsv import loadCsv
from util.writeCsv import writeCsv
from util.getAllHanzi import getAllHanzi

def findInMap(mapping, key):
    for row in mapping:
        if row[0] == key:
            return row[1]
    return None

def convertPinyin(char):
    return pinyin.get(char).replace('v̌', 'ǔ')

def convertTonelessPinyin(char):
    return pinyin.get(char, format="strip").replace('v', 'u')

if __name__ == '__main__':
    tonelessToZhuyinMap = loadCsv('data/maps/PinyinToneless-Zhuyin')
    allHanziSet = getAllHanzi()

    # our map has all unicode hanzi, traditional, and simplified
    # at least one of traditional or simplified WILL match hanzi
    outputMap = [("hanzi", "trad", "simp", "pinyin", "toneless", "tone", "zhuyin")]

    for char in allHanziSet:
        try:
            # TODO: this does NOT work for some characters like 了
            # check the manual entries map and use the values there instead
            trad = HanziConv.toTraditional(char)
            simp = HanziConv.toSimplified(char)
            # TODO: this library doesn't always work, it might be good to also make my own map I can check
            toneless = convertTonelessPinyin(char)
            pinyinNumerical = pinyin.get(char, format="numerical")
            numbers = re.findall(r'\d+', pinyinNumerical)
            tone = numbers[0] if numbers else None
            zhuyin = findInMap(tonelessToZhuyinMap, toneless)

            outputMap.append((
                char,
                trad,
                simp,
                convertPinyin(char),
                toneless,
                tone,
                zhuyin
            ))
        except:
            print('Error for char:' + char)

    writeCsv('../public/data/dictionary', outputMap)
