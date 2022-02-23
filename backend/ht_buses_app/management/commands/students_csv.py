import csv
from ...models import Student, School, Route, User
from django.core.management import BaseCommand
from django.utils import timezone

class Command(BaseCommand):
    help = "Loads student information into the Student table."

    def add_arguments(self, parser):
        parser.add_argument("file_path", type=str)

    def handle(self, *args, **options):
        start_time = timezone.now()
        path = options["file_path"]
        with open(path) as f:
            reader = csv.reader(f)
            next(reader, None)
            for row in reader:
                if row[0] == None or row[0] == "":
                    student_school_id = 11111
                else:
                    student_school_id = int(row[0])
                name = row[1].split()
                first_name = name[0]
                last_name = name[1]
                student = Student.studentsTable.create(
                    first_name = first_name,
                    last_name = last_name,
                    student_school_id = student_school_id,
                    school_id = School.schoolsTable.filter(name=row[2]),
                    route_id = None,
                    user_id = User.objects.filter(email=row[3])
                )
            end_time = timezone.now()
            self.stdout.write(
            self.style.SUCCESS(
                f"Loading CSV into Student table took: {(end_time-start_time).total_seconds()} seconds."
            )
        )

