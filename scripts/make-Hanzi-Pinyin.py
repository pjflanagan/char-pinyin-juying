
import json
import csv

def loadSourceDictionary():
    with open('data/source/bamboo-Hanzi-Pinyin.json') as f:
        return json.load(f)
    return None


if __name__ == '__main__':
    hanziPinyinMap = loadSourceDictionary()
    if hanziPinyinMap is None:
        print("Failed to load hanziPinyinMap")
        exit(1)

    outputMap = [("hanzi", "pinyin")]

    for char in hanziPinyinMap.keys():
        # take the first pinyin in the array
        pinyin = hanziPinyinMap[char][0]
        entry = (char, pinyin)
        outputMap.append(entry)

    with open("data/maps/Hanzi-Pinyin.csv", "wt") as fp:
        writer = csv.writer(fp, delimiter=",")
        writer.writerows(outputMap)
