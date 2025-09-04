
def getAllHanzi():
    hanzi = set()
    # Iterate through the primary Hanzi Unicode range
    for i in range(0x4E00, 0x9FFF + 1):
        hanzi.add(chr(i))

    # Iterate through a supplementary Hanzi Unicode range (Extension A)
    for i in range(0x3400, 0x4DBF + 1):
        hanzi.add(chr(i))
    
    return hanzi
