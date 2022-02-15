import csv
from ...models import Student, School, Route, User
from django.core.management import BaseCommand
from django.utils import timezone

class Command(BaseCommand):
    help = "Loads student information into a Student table."

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str)

    def handle(self, *args, **options):
        start_time = timezone.now()
        path = options["file_path"]
        with open(path) as f:
            reader = csv.reader(f)
            next(reader, None)
            for row in reader:
                student = Student.studentsTable.create(
                    first_name = row[0],
                    last_name = row[1],
                    student_school_id = row[2],
                    school_id = School.schoolsTable.get(pk=row[3]),
                    route_id = Route.routeTables.get(pk=row[4]),
                    user_id = User.objects.get(pk=row[5])
                )
            end_time = timezone.now()
            self.stdout.write(
            self.style.SUCCESS(
                f"Loading CSV took: {(end_time-start_time).total_seconds()} seconds."
            )
        )

