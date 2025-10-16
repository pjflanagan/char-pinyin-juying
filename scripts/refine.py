
import sys
from util.file import writeCsv, loadCsv
from util.mandarin import Phrase, Hanzi

SET_SIZE = 30
BASE_OUTPUT_HEADER = [("phrase", "english", "pinyin", "comments")]

def getCsvFileName(flashcardType: str, flashcardName: str, setIndex: int) -> str:
    if flashcardType == "set":
        return f"data/flashcards/set/{flashcardName}/{flashcardName}-{setIndex}"
    return f"data/flashcards/unit/{flashcardName}"


def loadAllFlashcards(flashcardType: str, flashcardName: str) -> list:
    setIndex = 1
    allFlashcards = []
    valid = True
    while valid:
        fileName = getCsvFileName(flashcardType, flashcardName, setIndex)
        print("Loading file:", fileName)
        try:
            flashcards = loadCsv(fileName)
            print("File contains", len(flashcards), "flashcards")
            allFlashcards.extend(flashcards)
            setIndex += 1
        except:
            print("No file:", fileName)
            valid = False
        if flashcardType != "set":
            valid = False
    return allFlashcards


def refineEntry(entry):
    # english
    english = ''
    if len(entry) > 1 and entry[1] != '':
        english = entry[1]
        print("English provided:", english, end=" - ")
    elif len(phrase) == 1:
        english = Hanzi.getEnglish(phrase)
        print("English refined for one word:", english, end=" - ")
    else:
        english = Phrase.translateEnglish(phrase)
        print("English refined using Google translate:", english, end=" - ")
    
    # pinyin
    pinyin = ''
    if len(entry) > 2 and entry[2] != '':
        pinyin = entry[2]
        print("Pinyin provided:", pinyin)
    else:
        pinyin = Phrase.getPinyin(phrase)
        print("Pinyin refined:", pinyin)
        
    # comment
    comment = ''
    if len(entry) > 3 and entry[3] != '':
        comment = entry[3]
        
    return (
                phrase,
                english,
                pinyin,
                comment
            )
    
if __name__ == '__main__':
    
    # get the type of refinement, either set or unit
    if len(sys.argv) > 1:
      print("Flashcard type:", sys.argv[1])
    else:
      print("Missing required flashcardType argument, must be one of `set` or `unit`.")
      exit(1)
    flashcardType = sys.argv[1]
    
    # get the name of the flashcard being refined
    if len(sys.argv) > 2:
      print("Flashcard set:", sys.argv[2])
    else:
      print("Missing required flashcardName argument.")
      exit(1)
    flashcardName = sys.argv[2]

    flashcards = loadAllFlashcards(flashcardType, flashcardName)
    print("Total flashcard count:", len(flashcards))

    outputMap = BASE_OUTPUT_HEADER.copy()
    phraseSet = []
    unitIndex = 1
    for entry in flashcards:
        try:
            phrase = Phrase.getTraditional(entry[0])
            print("Refining phrase:", phrase, end=" - ")
            
            # if there's a duplicate skip it
            if phrase in phraseSet:
                print("Duplicate skipped")
                continue
            else:
                phraseSet.append(phrase)

            refinedEntry = refineEntry(entry)
            outputMap.append(refinedEntry)
        except:
            print('ERROR processing phrase')

        if flashcardType == "set" and len(outputMap) == SET_SIZE + 1:
            writeCsv(getCsvFileName(flashcardType, flashcardName, unitIndex), outputMap)
            unitIndex += 1
            outputMap = BASE_OUTPUT_HEADER.copy()

    # end while
    writeCsv(getCsvFileName(flashcardType, flashcardName, unitIndex), outputMap)
