import requests
import threading
import time

update_queue = []
bus_coords = {}
is_running = False
def update_buses():
    # Example get response: {'bus': '4001', 'lat': 35.945681104358144, 'lng': -78.92782863290239}
    # Example get error: 'unknown response'
    threading.Timer(1.0, update_buses).start
    global is_running
    global update_queue
    global bus_coords
    is_running = True
    if len(update_queue) > 0:
        for index in range(0, 10) if len(update_queue) > 10 else range(0, len(update_queue)):
            url = 'http://tranzit.colab.duke.edu:8000/get' 
            params = {'bus': update_queue[index]}
            r = requests.get(url=url, params=params)
            data = r.json()
            if isinstance(data, dict):
                bus_coords[update_queue[index]] = {'lat': data['lat'], 'lng':data['lng']}
        print(update_queue)
        _next_ten()

def add_bus(bus_id):
    global update_queue
    update_queue.append(bus_id)
    update_queue = list(set(update_queue))

def remove_bus(bus_id):
    global update_queue
    global bus_coords
    update_queue.remove(bus_id)
    bus_coords.pop(bus_id)
    print(update_queue)

def get_coords():
    global bus_coords
    return bus_coords

def _next_ten():
    global update_queue
    if (len(update_queue) > 10):
        update_queue = update_queue[10:] + update_queue[:10]




