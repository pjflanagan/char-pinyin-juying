
import json
import csv

def loadSourceDictionary():
    with open('data/source/bamboo-Hanzi-English.json') as f:
        return json.load(f)
    return None


if __name__ == '__main__':
    hanziEnglishMap = loadSourceDictionary()
    if hanziEnglishMap is None:
        print("Failed to load hanziEnglishMap")
        exit(1)

    outputMap = [("hanzi", "english")]

    for char in hanziEnglishMap.keys():
        english = hanziEnglishMap[char]
        entry = (char, english)
        outputMap.append(entry)

    with open("data/maps/Hanzi-English.csv", "wt") as fp:
        writer = csv.writer(fp, delimiter=",")
        writer.writerows(outputMap)
