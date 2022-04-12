import transit_updates
import time

transit_updates.initialize_updater()
transit_updates.add_bus(4001)
time.sleep(5.0)
transit_updates.remove_bus(4001)
# transit_updates.get_coords()
# transit_updates.remove_bus(4001)
# time.sleep(2.0)
# transit_updates.get_coords()
# transit_updates.add_bus(4002)
# time.sleep(10.0)
# transit_updates.get_coords()