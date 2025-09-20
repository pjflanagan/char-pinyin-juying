
from hanziconv import HanziConv
from util.file import loadJson, writeCsv
from util.mandarin import getTraditional

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
            trad = getTraditional(phrase['simplified'])
            english = phrase['english'] if len(trad) == 1 else ''

            outputMap.append((
                trad,
                english
            ))
        except:
            print('Error for char:' + phrase['simplified'])

    writeCsv('data/sets/basic', outputMap)
