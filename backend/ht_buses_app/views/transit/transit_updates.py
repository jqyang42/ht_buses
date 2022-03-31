import requests
import threading
import time


class TransitUpdater(object): 
    def __init__(self):
        self.update_queue = []
        self.bus_coords = {}

    def update_buses(self):
        # Example get response: {'bus': '4001', 'lat': 35.945681104358144, 'lng': -78.92782863290239}
        # Example get error: 'unknown response'
        threading.Timer(1.0, self.update_buses).start
        if len(self.update_queue) > 0:
            for index in range(0, 10) if len(self.update_queue) > 10 else range(0, len(self.update_queue)):
                url = 'http://tranzit.colab.duke.edu:8000/get' 
                params = {'bus': self.update_queue[index]}
                r = requests.get(url=url, params=params)
                data = r.json()
                print(isinstance(data, dict))
                if isinstance(data, dict):
                    self.bus_coords[self.update_queue[index]] = {'lat': data['lat'], 'lng':data['lng']}
                else: 
                    self.bus_coords[self.update_queue[index]] = {'lat': 0, 'lng':0}
            self._next_ten()
    
    def add_bus(self, bus_id):
        self.update_queue.append(bus_id)
        self.update_queue = list(set(self.update_queue))
    
    def remove_bus(self, bus_id):
        self.update_queue.remove(bus_id)
        self.bus_coords.pop(bus_id)

    def get_coords(self):
        return self.bus_coords

    def _next_ten(self):
        if (len(self.update_queue) > 10):
            self.update_queue = self.update_queue[10:] + self.update_queue[:10]

testing = TransitUpdater()
testing.add_bus(4001)
testing.update_buses()
time.sleep(1.0)
print(testing.get_coords())
testing.remove_bus(4001)
time.sleep(1.0)
print(testing.get_coords())




