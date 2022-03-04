#!/bin/bash
# arguments: rsnapshot.x.err, email address
cat intro > email; cat $1 >> email; mailx -s 'Backup Error Alert: rsnapshot' $2 < email
