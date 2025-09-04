
import json

def loadJson(fileName):
    with open('data/' + fileName + '.json') as f:
        d = json.load(f)
        return d
    return None