
import sys
from util.file import writeCsv, loadCsv
from util.mandarin import Phrase, Hanzi

SET_SIZE = 30
BASE_OUTPUT_MAP = [("phrase", "english", "pinyin", "comments")]

def getCsvFileName(mode, setName, setIndex):
    if mode == "set":
        return f"data/flashcards/{setName}/{setName}-{setIndex}"
    return f"data/flashcards/{setName}"

def loadAllFlashcards(mode, setName):
    setIndex = 1
    allFlashcards = []
    valid = True
    while valid:
        fileName = getCsvFileName(mode, setName, setIndex)
        print("Loading file:", fileName)
        try:
            flashcards = loadCsv(fileName)
            print("File contains", len(flashcards), "flashcards")
            allFlashcards.extend(flashcards)
            setIndex += 1
        except:
            print("No file:", fileName)
            valid = False
        if mode != "set":
            valid = False
    return allFlashcards
    

if __name__ == '__main__':
    
    if len(sys.argv) > 1:
      print("Flashcard set:", sys.argv[1])
    else:
      print("Missing required set name argument.")
      exit(1)
    setName = sys.argv[1]

    mode = "default"
    if len(sys.argv) > 2 and sys.argv[2] == "set":
      print("Refining flashcards in set mode")
      mode = "set"

    flashcards = loadAllFlashcards(mode, setName)

    outputMap = BASE_OUTPUT_MAP.copy()
    phraseSet = []
    setIndex = 1

    print("Total flashcard count:", len(flashcards))
    for entry in flashcards:
        try:
            phrase = Phrase.getTraditional(entry[0])
            print("Refining phrase:", phrase)
            
            # if there's a duplicate skip it
            if phrase in phraseSet:
                print("Duplicate phrase", phrase)
                continue
            else:
                phraseSet.append(phrase)

            english = ''
            if len(entry) > 1 and entry[1] != '':
                english = entry[1]
                print("English provided:", english)
            elif len(phrase) == 1:
                english = Hanzi.getEnglish(phrase)
                print("English refined for one word:", english)
            else:
                english = Phrase.translateEnglish(phrase)
                print("English refined using Google translate:", english)
            
            pinyin = ''
            if len(entry) > 2 and entry[2] != '':
                pinyin = entry[2]
                print("Pinyin provided:", pinyin)
            else:
                pinyin = Phrase.getPinyin(phrase)
                print("Pinyin refined:", pinyin)
                
            comment = ''
            if len(entry) > 3 and entry[3] != '':
                comment = entry[3]

            outputMap.append((
                phrase,
                english,
                pinyin,
                comment
            ))
        except:
            print('Error for phrase:' + phrase)

        if mode == "set" and len(outputMap) == SET_SIZE + 1:
            writeCsv(getCsvFileName(mode, setName, setIndex), outputMap)
            setIndex += 1
            outputMap = BASE_OUTPUT_MAP.copy()

    # end while
    writeCsv(getCsvFileName(mode, setName, setIndex), outputMap)
