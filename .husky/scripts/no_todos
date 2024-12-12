#!/bin/sh

FOUND_TODOS=$(git diff --cached --name-only --diff-filter=AM | grep -v '.husky' | xargs -r grep -l 'TODO')

if [ -z "$FOUND_TODOS" ]; then # To check if FOUND_TODOS is not empty
  exit 0
fi

bold_yellow_prefix="\033[1;33m"
bold_yellow_suffix="\033[00m"

bold_green_prefix="\033[1;32m"
bold_green_suffix="\033[00m"

bold_red_prefix="\033[1;31m"
bold_red_suffix="\033[00m"

echo "$bold_yellow_prefix"Your project has some TODOs: "$bold_yellow_suffix"
printf %s "$FOUND_TODOS"
echo "\n"

exit 1
