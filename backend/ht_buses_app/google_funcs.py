import googlemaps
import os

gmaps = googlemaps.Client(key='AIzaSyDKBCCbU8w69KvLefPmHtFRTsP6KAFXp0s')
def geocode_address(addresses):
    geocodes = []
    for address in addresses:
        geocodes.append(gmaps.geocode(address)[0]['geometry']['location'])
    return geocodes

address = ['1600 Amphitheatre Parkway, Mountain View, CA']
print(geocode_address(address))