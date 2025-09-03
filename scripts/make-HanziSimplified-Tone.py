

import json
import csv
import re

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

    outputMap = [("hanziSimplified", "tone")]
    
    for entry in cedict:
        if len(entry['traditional']) == 1:
          pinyin = entry['pinyin']
          numbers = re.findall(r'\d+', pinyin)
          tone = numbers[0] if numbers else None
          newEntry = (entry['simplified'], tone)
          outputMap.append(newEntry)
          
    with open("data/maps/HanziSimplified-Tone.csv", "wt") as fp:
        writer = csv.writer(fp, delimiter=",")
        writer.writerows(outputMap)