
import csv

def writeCsv(name, content):
    with open("data/" + name + ".csv", "wt") as fp:
        writer = csv.writer(fp, delimiter=",")
        writer.writerows(content)