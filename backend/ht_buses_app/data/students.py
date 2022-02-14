from ..models import Student
import csv

def student_data_loading(path):
    with open(path) as f:
        reader = csv.reader(f)
        next(reader, None)
        for row in reader:
            student = Student.studentsTable.create(
                first_name = row[0],
                last_name = row[1],
                student_school_id = row[2],
                school_id = row[3],
                route_id = row[4],
                user_id = row[5]
                )

if __name__ == '__main__':
    student_data_loading('/home/ec220/ht_buses/backend/ht_buses_app/data/files/students.csv')
