import googlemaps
import os

gmaps = googlemaps.Client(key='AIzaSyDKBCCbU8w69KvLefPmHtFRTsP6KAFXp0s')
def geocode_address(address):
    geocodes = []
    #for address in addresses:
    geocodes.append(gmaps.geocode(address)[0]['geometry']['location'])
    return geocodes