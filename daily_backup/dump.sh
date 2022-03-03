#/bin/bash
# runs pg_dump
sudo -u postgres pg_dump -Fc ht_buses > ht_buses.dump 2> ht_buses.dump.err
