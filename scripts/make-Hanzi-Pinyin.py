
from unidecode import unidecode
import re
import pinyin
from util.loadJson import loadJson
from util.writeCsv import writeCsv
from util.getAllHanzi import getAllHanzi

if __name__ == '__main__':
    hanziPinyinMap = loadJson('bamboo-Hanzi-Pinyin')
    allHanziSet = getAllHanzi()

    outputMap = [("hanzi", "pinyin", "pinyinToneless", "tone")]

    for char in allHanziSet:
        try:
            pinyinToneless = pinyin.get(char, format="strip")
            pinyinNumerical = pinyin.get(char, format="numerical")
            numbers = re.findall(r'\d+', pinyinNumerical)
            tone = numbers[0] if numbers else None

            outputMap.append((
                char,
                pinyin.get(char),
                pinyinToneless,
                tone
            ))
        except:
            print('Error for char:' + char)

    writeCsv('maps/Hanzi-Pinyin', outputMap)
