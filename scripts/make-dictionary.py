
import csv
from util.getAllHanzi import getAllHanzi

def loadSourceMap(name):
    with open("data/maps/" + name + ".csv") as fp:
        reader = csv.reader(fp, delimiter=",", quotechar='"')
        next(reader, None)  # skip the headers
        return [row for row in reader]
    return []

def findInList(mapping, key):
    for row in mapping:
        if row[0] == key:
            return row[1]
    return None

if __name__ == '__main__':
    hanziToEnglishMap = loadSourceMap("Hanzi-English")
    hanziToPinyinMap = loadSourceMap("Hanzi-Pinyin")
    hanziToPinyinTonelessMap = loadSourceMap("Hanzi-PinyinToneless")
    hanziSimplifiedToHanziTraditionalMap = loadSourceMap("HanziSimplified-HanziTraditional")
    pinyinTonelessToZhuyinMap = loadSourceMap("PinyinToneless-Zhuyin")
    hanziSimplifiedToTone = loadSourceMap("HanziSimplified-Tone")

    # create a set of all the simplified characters
    # add all the simplified characters to the set
    allHanziSet = getAllHanzi()

    # TODO: TODO: TODO:
    # hanzi should be a list of all simplified and traditional, one of hanziSimplified and hanziTraditional WILL match
    outputRows = [('hanzi', 'hanziSimplified','hanziTraditional','zhuyin','pinyin','tone','english')]

    for hanzi in allHanziSet:
        hanziTraditional = findInList(hanziSimplifiedToHanziTraditionalMap, hanziSimplified)
        pinyinToneless = findInList(hanziToPinyinTonelessMap, hanziSimplified)
        zhuyin = findInList(pinyinTonelessToZhuyinMap, pinyinToneless)
        pinyin = findInList(hanziToPinyinMap, hanziSimplified)
        tone = findInList(hanziSimplifiedToTone, hanziSimplified)
        english = findInList(hanziToEnglishMap, hanziSimplified)
        outputRows.append((hanzi, hanziSimplified, hanziTraditional, zhuyin, pinyin, tone, english))

    with open("data/dictionary.csv", "wt") as fp:
        writer = csv.writer(fp, delimiter=",")
        writer.writerows(outputRows)

