#!/bin/sh

# Switch learning modes between human and auto

if [ "$1" = "human" ]; then
    sed -i 's/var is_human_learning = false;/var is_human_learning = true;/g' src/automation.js
    exit
fi

sed -i 's/var is_human_learning = true;/var is_human_learning = false;/g' src/automation.js
