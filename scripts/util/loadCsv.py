
import csv

def loadCsv(fileName):
    with open("data/source/" + fileName + ".csv") as fp:
        reader = csv.reader(fp, delimiter=",", quotechar='"')
        next(reader, None)  # skip the headers
        return [row for row in reader]