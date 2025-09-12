
import json

def loadJson(fileName):
    with open(fileName + '.json') as f:
        d = json.load(f)
        return d
    return None