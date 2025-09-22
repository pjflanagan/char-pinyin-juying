
import sys
from util.file import writeCsv, loadCsv
from util.mandarin import Phrase, Hanzi

if __name__ == '__main__':
    
    if len(sys.argv) > 1:
      print("First argument:", sys.argv[1])
    else:
      print("No arguments provided.")
      exit(1)

    setName = sys.argv[1]
    set = loadCsv('data/flashcards/' + setName)

    outputMap = [("phrase", "english", "pinyin")]

    for entry in set:
        try:
            phrase = Phrase.getTraditional(entry[0])

            translation = None
            english = ''
            if len(entry) > 1 and entry[1] != '':
                english = entry[1]
            elif len(phrase) == 1:
                english = Hanzi.getEnglish(phrase)
            else:
                translation = Phrase.translate(phrase)
                english = translation.english
            
            pinyin = ''
            if len(entry) > 2 and entry[2] != '':
                pinyin = entry[2]
            elif len(phrase) == 1:
                pinyin = Hanzi.getPinyin(phrase)
            elif translation != None:
                pinyin = translation.pinyin
            else:
                translation = Phrase.translate(phrase)
                pinyin = translation.pinyin

            outputMap.append((
                phrase,
                english,
                pinyin
            ))
        except:
            print('Error for phrase:' + phrase)

    writeCsv('data/flashcards/' + setName, outputMap)
