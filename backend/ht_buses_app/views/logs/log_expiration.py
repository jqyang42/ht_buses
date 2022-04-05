from ...serializers import LogSerializer, BusSerializer
from ...models import Log, Bus
from datetime import datetime, timezone
from pytz import timezone
from datetime import timedelta, datetime
from ht_buses_app.views.buses import transit_updates

def log_expiration():
    all_logs = Log.objects.all()
    edt = timezone('US/Eastern')
    all_logs_serializer = LogSerializer(all_logs, many=True)
    for log in all_logs_serializer.data:
        log_obj = Log.objects.get(pk=log["id"])
        if log_obj.duration == timedelta(hours=0):
            # check if its been 3 hrs
            start_time = log_obj.start_time
            d_start_time = edt.localize(datetime.combine(log_obj.date, start_time))
            time_end = datetime.now(edt)
            expire_hour = time_end - d_start_time
            if expire_hour >= timedelta(hours=3):
                # expire log
                log_obj.duration = timedelta(hours=3)
                log_obj.save()
                # need to make bus as not running
                bus_obj = Bus.objects.filter(bus_number=log_obj.bus_number)
                bus_serializer = BusSerializer(bus_obj[0], many=False)
                bus = Bus.objects.get(pk=bus_serializer.data["id"])
                bus.is_running = False
                bus.save()
                if transit_updates.is_running:
                    transit_updates.remove_bus(log_obj.bus_number)

            

            