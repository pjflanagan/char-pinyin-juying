
import json
import csv
from unidecode import unidecode

def loadSourceDictionary():
    with open('data/source/bamboo-Hanzi-Pinyin.json') as f:
        return json.load(f)
    return None


if __name__ == '__main__':
    hanziPinyinMap = loadSourceDictionary()
    if hanziPinyinMap is None:
        print("Failed to load hanziPinyinMap")
        exit(1)

    outputMap = [("hanzi", "pinyinToneless")]

    for char in hanziPinyinMap.keys():
        pinyin = hanziPinyinMap[char][0] # take the first pinyin in the array
        entry = (char, unidecode(pinyin))
        outputMap.append(entry)

    with open("data/maps/Hanzi-PinyinToneless.csv", "wt") as fp:
        writer = csv.writer(fp, delimiter=",")
        writer.writerows(outputMap)
