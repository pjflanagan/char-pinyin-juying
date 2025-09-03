
import json
import csv

def loadSourceDictionary():
    with open("data/source/pinyin-zhuyin.csv") as fp:
        reader = csv.reader(fp, delimiter=",", quotechar='"')
        next(reader, None)  # skip the headers
        return [row for row in reader]


if __name__ == '__main__':
    pinyinZhuyinMap = loadSourceDictionary()
    if pinyinZhuyinMap is None:
        print("Failed to load pinyinZhuyinMap")
        exit(1)

    outputMap = [("hanzi", "pinyinToneless")]

    for row in pinyinZhuyinMap:
        entry = (row[0], row[1])
        outputMap.append(entry)

    with open("data/maps/PinyinToneless-Zhuyin.csv", "wt") as fp:
        writer = csv.writer(fp, delimiter=",")
        writer.writerows(outputMap)
