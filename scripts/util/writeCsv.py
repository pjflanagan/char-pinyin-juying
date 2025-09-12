
import csv

def writeCsv(name, content):
    with open(name + ".csv", "wt") as fp:
        writer = csv.writer(fp, delimiter=",")
        writer.writerows(content)