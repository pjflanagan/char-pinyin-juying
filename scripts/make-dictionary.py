
# TODO: get all the one character lines from cedict
# match all the traditional to pinyin
# maybe export it as a CSV?

# trad,simp,juying,pinyin,english


import json


def loadSourceDictionary():
    with open('data/source/cedict.json') as f:
        d = json.load(f)
        return d
    return None

def loadSourceCharacters():
    with open('data/source/chars.json') as f:
        d = json.load(f)
        return d

if __name__ == '__main__':
    chars = loadSourceCharacters()
    if chars is None:
        print("Failed to load chars")
        exit(1)
    charKeys = chars.keys()

    cedict = loadSourceDictionary()
    if cedict is None:
        print("Failed to load cedict")
        exit(1)

    resultArray = []
    resultDict = {}
    
    i = 0
    for traditionalCharacter in charKeys:
        entry = next((x for x in cedict if x["traditional"] == traditionalCharacter), None)

        if entry:

          newEntry = {
              'trad': traditionalCharacter,
              'simp': entry["simplified"],
              'juying': chars[traditionalCharacter],
              'pinyin': entry["pinyin"],
              'english': entry["english"]
          }

          resultDict[traditionalCharacter] = newEntry
          resultArray.append(newEntry)

          print(newEntry)
          i += 1
          if (i > 10):
              break
