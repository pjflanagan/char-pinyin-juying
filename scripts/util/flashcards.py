
def getCsvFileName(flashcardType: str, flashcardName: str, unitIndex: int) -> str:
    if flashcardType == "unit":
        return f"data/flashcards/unit/{flashcardName}/{flashcardName}-{unitIndex}"
    return f"data/flashcards/set/{flashcardName}"
