
from util.file import loadJson, writeCsv
from util.mandarin import Phrase

def findInMap(mapping, key):
    for row in mapping:
        if row[0] == key:
            return row[1]
    return None

if __name__ == '__main__':
    chromeExtensionPhrases = loadJson('data/source/chrome-extension-phrases')

    outputMap = [("phrase", "english", "pinyin")]

    for phrase in chromeExtensionPhrases:
        try:
            trad = Phrase.getTraditional(phrase['simplified'])

            # only keep the english if it is a single character
            english = phrase['english'] if len(trad) == 1 else ''

            outputMap.append((
                trad,
                english,
                phrase["pinyin"]
            ))
        except:
            print('Error for char:' + phrase['simplified'])

    writeCsv('data/flashcards/basic', outputMap)
