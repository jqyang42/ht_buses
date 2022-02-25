import csv
from ...models import Location, School
from django.core.management import BaseCommand
from django.utils import timezone
from ...google_funcs import geocode_address
from datetime import datetime

class Command(BaseCommand):
    help = "Loads school information into the School table."

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str)

    def handle(self, *args, **options):
        start_time = timezone.now()
        path = options["file_path"]
        with open(path) as f:
            reader = csv.reader(f)
            next(reader, None)
            for row in reader:
                location_arr = geocode_address(row[1])
                location = Location.objects.create(
                    address=row[1],
                    lat=location_arr[0]["lat"],
                    lng=location_arr[0]["lng"]
                )
                school = School.objects.create(
                    location_id=location,
                    name=row[0],
                    arrival=datetime.time(datetime.strptime(row[2],"%H:%M")),
                    departure=datetime.time(datetime.strptime(row[3],"%H:%M"))
                )
            end_time = timezone.now()
            self.stdout.write(
            self.style.SUCCESS(
                f"Loading CSV into School table took: {(end_time-start_time).total_seconds()} seconds."
            )
        )

