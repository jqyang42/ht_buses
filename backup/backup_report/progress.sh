#!/bin/bash
# arguments: stats file, email address
touch email_prog;
echo -e "A daily backup has been taken. Errors, if any, have been reported. Select meta data about the backup is as follows: \n" > email_prog;
cat $1 >> email_prog;

mailx -r "HT-Backup-Server" -s "Daily Backup Progress" $2 < email_prog;

rm email_prog