from hanziconv import HanziConv
from util.file import writeCsv, loadCsv
from util.mandarin import getAllHanzi, getTonelessPinyin, getTone, getPinyin, getTraditional

def findInMap(mapping, key):
    for row in mapping:
        if row[0] == key:
            return row[1]
    return None

if __name__ == '__main__':
    tonelessToZhuyinMap = loadCsv('data/maps/PinyinToneless-Zhuyin')
    allHanziSet = getAllHanzi()

    # our map has all unicode hanzi, traditional, and simplified
    # at least one of traditional or simplified WILL match hanzi
    outputMap = [("hanzi", "trad", "simp", "pinyin", "toneless", "tone", "zhuyin")]

    for char in allHanziSet:
        try:
            trad = getTraditional(char)
            simp = HanziConv.toSimplified(char)
            toneless = getTonelessPinyin(char)
            tone = getTone(char)

            zhuyin = findInMap(tonelessToZhuyinMap, toneless)

            outputMap.append((
                char,
                trad,
                simp,
                getPinyin(char),
                toneless,
                tone,
                zhuyin
            ))
        except:
            print('Error for char:' + char)

    writeCsv('data/dictionary', outputMap)
