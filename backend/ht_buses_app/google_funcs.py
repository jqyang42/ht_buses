import googlemaps
import os

gmaps = googlemaps.Client(key='AIzaSyDKBCCbU8w69KvLefPmHtFRTsP6KAFXp0s')
def geocode_address(address):
    geocodes = []
    #for address in addresses:
    try:
        geocodes.append(gmaps.geocode(address)[0]['geometry']['location'])
    except:
        return geocodes
    return geocodes