import json
import os

__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))

def bulk_import_file_save(filename, data):
    with open(os.path.join(__location__, filename), 'w') as output:
        json.dump(data, output)

def bulk_import_file_read(filename):
    json_stream = ''
    with open(os.path.join(__location__, filename), 'r') as output:
        json_stream = json.load(output)
    return json_stream

def bulk_import_file_delete(filename):
    os.remove(os.path.join(__location__, filename))
