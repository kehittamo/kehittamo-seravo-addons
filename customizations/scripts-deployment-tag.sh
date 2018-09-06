#!/bin/bash
echo "Tagging the latest release..."
if ! [[ $WP_ENV = "staging" || $WP_ENV = "production" ]]; then
  echo "error: Environment ($WP_ENV) not staging or production."
  exit 1;
fi

# Perl script to validate tag
MATCH='if (/^v?\d+\.\d+(?:\.\d+)(?:-production|-staging|)\n/) { print "$&"; }'

# Get highest tag number
LATEST_TAG=`git describe --abbrev=0 --tags 2>/dev/null`
NEW_TAG="1.0.0-$WP_ENV"

# If the latest tag exists we validate it.
if [[ ! -z $LATEST_TAG ]]; then
  VALIDATE=`echo $LATEST_TAG | perl -ne "$MATCH"`;

  if [[ $LATEST_TAG = $VALIDATE ]]; then
    # Split tag version into an array.
    LATEST_TAG_PARTS=(${LATEST_TAG//./ })

    # Get version parts and, strip the suffix from
    # the last one and increase it by 1.
    VNUM1=${LATEST_TAG_PARTS[0]}
    VNUM2=${LATEST_TAG_PARTS[1]}
    VNUM3=$(echo ${LATEST_TAG_PARTS[2]} | sed 's/[^0-9]*//g')
    VNUM3=$((VNUM3+1))

    # Format new tag
    NEW_TAG="$VNUM1.$VNUM2.$VNUM3-$WP_ENV"
  fi
fi

GIT_COMMIT=`git rev-parse HEAD`
NEEDS_TAG=`git describe --contains $GIT_COMMIT 2>/dev/null`

# Only add a new tag if current commit has not been tagged. 
if [[ -z "$NEEDS_TAG" ]]; then
  if git tag $NEW_TAG; then
    echo "success: $NEW_TAG tag added."
    # git push --tags
  else
    echo "error: $NEW_TAG was not added."
    exit 1;
  fi
else
  echo "info: There's already a tag on this commit, no tag added."
fi

