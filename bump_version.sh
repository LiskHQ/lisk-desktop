#!/bin/bash

function bump {
	search='("version":[[:space:]]*").+(")'
	replace="\1${release}\2"
	
	sed -i ".tmp" -E "s/${search}/${replace}/g" "$1"
	rm "$1.tmp"
  git add "$1"
}

function help {
	echo "Usage: $(basename $0) <newversion>"
	echo "  e.g. $(basename $0) 0.1.0"
	echo "       $(basename $0) 0.1.0-rc.1"
}

if [ -z "$1" ] || [ "$1" = "help" ] || [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-rc\.[0-9]+)?$ ]]; then
	help
	exit
fi

release=$1

changes=$(git status --porcelain -uno)

if [ -z "${changes}" ]; then
  bump "package.json"
  bump "app/package.json"

  git commit -m "Bump Lisk Hub to ${release}"
  git tag "v${release}"
  git push origin
  git push origin --tags
  echo "Successful bump to ${release}"
else
  echo "Please commit staged files prior to bumping"
fi

