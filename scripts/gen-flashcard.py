
import sys
from util.file import writeCsv, loadCsv
from util.mandarin import Hanzi, Phrase, Pinyin

def findInMap(mapping, key):
    for row in mapping:
        if row[0] == key:
            return row[1]
    return None

if __name__ == '__main__':
    
    if len(sys.argv) > 1:
      print("First argument:", sys.argv[1])
    else:
      print("No arguments provided.")
      exit(1)

    setName = sys.argv[1]
    set = loadCsv('data/set/' + setName)

    outputMap = [("phrase", "english", "pinyin", "tone", "zhuyin")]

    for entry in set:
        # TODO: get the overrides from the entry
        try:
            phrase = Phrase.getTraditional(entry[0])
            translation = {}

            english = ''
            if len(entry) > 1 and entry[1] != '':
                english = entry[1]
            else:
                # TODO: get english from google
                print()
            
            pinyin = ''
            if len(entry) > 2 and entry[2] != '':
                pinyin = entry[2]
            else:
                # TOOD: get the pinyin from the translation
                print()

            toneless = Pinyin.stripTones(pinyin)
            tone = getTone(char)

            zhuyin = findInMap(tonelessToZhuyinMap, toneless)

            outputMap.append((
                phrase,
                getPinyin(char),
                toneless,
                tone,
                zhuyin
            ))
        except:
            print('Error for phrase:' + char)

    writeCsv('data/dictionary', outputMap)
