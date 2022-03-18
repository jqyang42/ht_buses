#!/bin/bash
# arguments: source of error, error file, email address
touch email_err;
echo -e "The following error was produced from $1:\n" > email_err;
cat $2 >> email_err;

if [[ -n $(cat $2) ]];
then
        mailx -s "Backup Error Alert: $1" $3 < email_err;
fi

rm email_err;