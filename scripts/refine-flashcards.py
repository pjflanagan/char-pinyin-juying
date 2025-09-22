
import sys
from util.file import writeCsv, loadCsv
from util.mandarin import Phrase, Hanzi

if __name__ == '__main__':
    
    if len(sys.argv) > 1:
      print("Flashcard set:", sys.argv[1])
    else:
      print("No arguments provided.")
      exit(1)

    setName = sys.argv[1]
    set = loadCsv(f"data/flashcards/{setName}")

    outputMap = [("phrase", "english", "pinyin")]

    for entry in set:
        try:
            phrase = Phrase.getTraditional(entry[0])
            print(phrase)

            english = ''
            if len(entry) > 1 and entry[1] != '':
                english = entry[1]
            elif len(phrase) == 1:
                english = Hanzi.getEnglish(phrase)
            else:
                english = Phrase.translateEnglish(phrase)
            
            pinyin = ''
            if len(entry) > 2 and entry[2] != '':
                pinyin = entry[2]
            else:
                pinyin = Phrase.getPinyin(phrase)

            outputMap.append((
                phrase,
                english,
                pinyin
            ))
        except:
            print('Error for phrase:' + phrase)

    writeCsv(f"data/flashcards/{setName}", outputMap)
