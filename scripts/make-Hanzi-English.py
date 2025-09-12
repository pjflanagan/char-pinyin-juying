
from util.loadJson import loadJson
from util.writeCsv import writeCsv

if __name__ == '__main__':
    # TODO: this is not a very comprehensive map, find a new one
    hanziEnglishMap = loadJson('data/source/bamboo-Hanzi-English')
    if hanziEnglishMap is None:
        print("Failed to load hanziEnglishMap")
        exit(1)

    outputMap = [("hanzi", "english")]

    for char in hanziEnglishMap.keys():
        english = hanziEnglishMap[char]
        entry = (char, english)
        outputMap.append(entry)

    writeCsv("data/maps/Hanzi-English", outputMap)