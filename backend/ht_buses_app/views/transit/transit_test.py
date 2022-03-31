import transit_updates
import time

transit_updates.add_bus(4001)
transit_updates.update_buses()
time.sleep(1.0)
print(transit_updates.get_coords())
transit_updates.remove_bus(4001)
time.sleep(1.0)
print(transit_updates.get_coords())




