
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

if __name__ == '__main__':
    tonelessToZhuyinMap = loadCsv('maps/PinyinToneless-Zhuyin')
    allHanziSet = getAllHanzi()

    outputMap = [("hanzi", "trad", "simp", "pinyin", "toneless", "tone", "zhuyin")]

    for char in allHanziSet:
        try:
            trad = HanziConv.toTraditional(char)
            simp = HanziConv.toSimplified(char)
            # TODO: this library doesn't always work
            # it might be good to also make my own map I can check
            toneless = pinyin.get(char, format="strip")
            pinyinNumerical = pinyin.get(char, format="numerical")
            numbers = re.findall(r'\d+', pinyinNumerical)
            tone = numbers[0] if numbers else None
            zhuyin = findInMap(tonelessToZhuyinMap, toneless)

            outputMap.append((
                char,
                trad,
                simp,
                pinyin.get(char),
                toneless,
                tone,
                zhuyin
            ))
        except:
            print('Error for char:' + char)

    writeCsv('dictionary', outputMap)
