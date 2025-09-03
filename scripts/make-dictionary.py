


import json
import csv


def loadSourceMap(name):
    with open("data/maps/" + name + ".csv") as fp:
        reader = csv.reader(fp, delimiter=",", quotechar='"')
        next(reader, None)  # skip the headers
        return [row for row in reader]
    return []

if __name__ == '__main__':

    # create a set of all the simplified characters
    hanziSimplifiedSet = set()

    hanziSimplifiedToHanziTraditionalMap = loadSourceMap("HanziSimplified-HanziTraditional")

    # add all the simplified characters to the set
    for row in hanziSimplifiedToHanziTraditionalMap:
        hanziSimplifiedSet.add(row[0])

    outputRows = []
