
from hanziconv import HanziConv
from util.file import loadJson, writeCsv    

def findInMap(mapping, key):
    for row in mapping:
        if row[0] == key:
            return row[1]
    return None

if __name__ == '__main__':
    chromeExtensionPhrases = loadJson('data/source/chrome-extension-phrases')

    outputMap = [("phrase", "english")]

    for phrase in chromeExtensionPhrases:
        try:
            # TODO: this does NOT work for some characters like 了
            # check the manual entries map and use the values there instead
            trad = HanziConv.toTraditional(phrase['simplified'])

            outputMap.append((
                trad,
                phrase['english']
            ))
        except:
            print('Error for char:' + phrase['simplified'])

    writeCsv('data/flashcards/basic', outputMap)
