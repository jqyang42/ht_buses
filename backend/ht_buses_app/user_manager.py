'''
class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name,is_parent, address, password, lat, lng, role, phone_number):
        if not email:
            raise ValueError('Users must have email address')
        if not first_name:
            raise ValueError('Users must have a first name')
        if not last_name:
            raise ValueError('Users must have a last name')
        if is_parent is True and not address:
                raise ValueError('Users must have an address')
        location_obj = Location.objects.create(address=address, lat=lat, lng=lng)
        user = self.model(
            email= self.normalize_email(email),
            first_name = first_name,
            last_name = last_name,
            is_parent = is_parent,
            phone_number = phone_number
            )

        if role < 5 and role > 0:
            user.role = role
            if role == 1: 
                user.groups.add(admin_group)
            #elif role == 2:
            #user.groups.add(school_staff_group)
            elif role == 3:
                user.groups.add(bus_driver_group)
        else:
            user.role = 4
        user.location_id = location_obj.id
        user.set_password(password)
        user.save(using= self._db)
        return user 
       
    def create_superuser(self, email, first_name, last_name, is_parent, password, address="", lat=0, lng=0,):
        user = self.create_user(email, first_name, last_name, is_parent, address, password, lat, lng, role=1, phone_number=None)
        user.role = User.ADMIN
        user.save(using=self._db)
        return user
'''