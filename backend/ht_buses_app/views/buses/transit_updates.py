import requests
import threading
import time
import traceback
from . import bus_management

from ..logs.log_expiration import log_expiration

update_queue = []
bus_coords = {}
is_running = False

class RepeatTimer(threading.Timer):
    def run(self):
        while not self.finished.wait(self.interval):
            self.function(*self.args, **self.kwargs)

def update_buses():
    # Example get response: {'bus': '4001', 'lat': 35.945681104358144, 'lng': -78.92782863290239}
    # Example get error: 'unknown bus'
    global is_running
    global update_queue
    global bus_coords
    is_running = True
    if len(update_queue) > 0:
        try:
            for index in range(0, 10) if len(update_queue) > 10 else range(0, len(update_queue)):
                url = 'http://tranzit.colab.duke.edu:8000/get'
                bus_num = update_queue[index]
                params = {'bus': bus_num}
                r = requests.get(url=url, params=params, timeout=10)
                data = r.json()
                if isinstance(data, dict):
                    bus_coords[bus_num] = {'lat': data.get('lat'), 'lng':data.get('lng')}
                    bus_management.bus_location_update(bus_num, data.get('lat'), data.get('lng'))
            _next_ten()
        except:
            traceback.print_exc()
            print("queue is empty")

def add_bus(bus_id):
    global update_queue
    update_queue.append(bus_id)
    print(update_queue)

def remove_bus(bus_id):
    global update_queue
    global bus_coords
    print(bus_id)
    bus_coords.pop(bus_id, 0)
    update_queue.remove(bus_id)
    print(update_queue)

def get_coords():
    global bus_coords
    return bus_coords

def initialize_updater(active_buses="none"):
    global update_queue
    if active_buses != "none":
        print(active_buses)
        for bus in active_buses:
            update_queue.append(bus.get('bus_number'))
    timer = RepeatTimer(4, update_buses)
    timer.start()

def _next_ten():
    global update_queue
    if (len(update_queue) > 10):
        update_queue = update_queue[10:] + update_queue[:10]




