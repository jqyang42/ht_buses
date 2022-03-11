from rest_framework.response import Response


def PermissionDenied(data={}, source=""):
    data["message"] = "permission denied, user does not have access to this "+source
    data["success"] = False
    return Response(data, status = 403)

def UnsuccessfulChange(data={}, source=""):
    data["message"] = soure + "could not be edited"
    data["success"] = False
    return Response(data, status = 400)

def UnsuccessfulAction(data={}, source=""):
    data["message"] = "action could not be completed"
    data["success"] = False
    return Response(data, status = 400)

def DoesNotExist(data={}, source=""):
    data["message"] = source+" could not be found"
    data["success"] = False
    return Response(data, status = 404)




    