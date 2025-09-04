
from util.loadCsv import loadCsv
from util.writeCsv import writeCsv

if __name__ == '__main__':
    pinyinZhuyinMap = loadCsv('pinyin-zhuyin')

    outputMap = [("hanzi", "pinyinToneless")]

    for row in pinyinZhuyinMap:
        entry = (row[0], row[1])
        outputMap.append(entry)

    writeCsv("maps/PinyinToneless-Zhuyin", outputMap)