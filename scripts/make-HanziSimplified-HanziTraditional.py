

import json
import csv


def loadSourceDictionary():
    with open('data/source/cedict-HanziSimplified-HanziTraditional.json') as f:
        d = json.load(f)
        return d
    return None


if __name__ == '__main__':

    cedict = loadSourceDictionary()
    if cedict is None:
        print("Failed to load cedict")
        exit(1)

    outputMap = [("hanziSimplified", "hanziTraditional")]
    
    for entry in cedict:
        if len(entry['traditional']) == 1:
          newEntry = (entry['simplified'], entry['traditional'])
          outputMap.append(newEntry)
          
    with open("data/maps/HanziSimplified-HanziTraditional.csv", "wt") as fp:
        writer = csv.writer(fp, delimiter=",")
        writer.writerows(outputMap)