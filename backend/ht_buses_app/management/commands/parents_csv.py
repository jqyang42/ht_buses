import csv
from ...models import User, Location
from django.core.management import BaseCommand
from django.utils import timezone
from ...google_funcs import geocode_address

class Command(BaseCommand):
    help = "Loads parent information into the Parent table."

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str)

    def handle(self, *args, **options):
        start_time = timezone.now()
        path = options["file_path"]
        with open(path) as f:
            reader = csv.reader(f)
            next(reader, None)
            for row in reader:
                name = row[0].split()
                first_name = name[0]
                last_name = name[1]
                # make location object
                # call google api
                location_arr = geocode_address(row[2])
                location = Location.objects.create(
                    address=row[2],
                    lat=location_arr[0]["lat"],
                    lng=location_arr[0]["lng"]
                )
                user = User.objects.create(
                    first_name = first_name,
                    last_name = last_name,
                    email = row[1],
                    is_parent = True,
                    is_staff = False,
                    location = location
                )
            end_time = timezone.now()
            self.stdout.write(
            self.style.SUCCESS(
                f"Loading CSV into Parent table took: {(end_time-start_time).total_seconds()} seconds."
            )
        )

