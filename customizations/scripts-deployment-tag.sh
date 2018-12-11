#!/bin/bash
echo "Tagging the latest release..."
if ! [[ $WP_ENV = "staging" || $WP_ENV = "production" ]]; then
  echo "error: Environment \$WP_ENV ($WP_ENV) not staging or production in your current shell environment ($SHELL)."
  exit 1
fi

GIT_COMMIT=`git rev-parse HEAD`
CURRENT_TAGGED=`git describe --contains $GIT_COMMIT 2>/dev/null`

# Only add a new tag if current commit has not been tagged.
if [[ -n "$CURRENT_TAGGED" ]]; then
  echo "info: There's already a tag on this commit, no tag added."
  exit
fi

# Perl script to validate tags
MATCH='if (/^v?\d+\.\d+(?:\.\d+)(?:-production|-staging|)\n/) { print "$&"; }'

# Get tags array and set default new tag
TAGS=($(git tag --sort=-creatordate))
NEW_TAG="1.0.0-$WP_ENV"

# Check if any tag passes validation and use the latest one as the starting point.
for TAG in "${TAGS[@]}"
do
  VALIDATE=`echo $TAG | perl -ne "$MATCH"`

  if [[ $TAG = $VALIDATE ]]; then
    # Split tag version into an array.
    TAG_PARTS=(${TAG//./ })

    # Get version parts and strip the suffix.
    VNUM1=${TAG_PARTS[0]}
    VNUM2=${TAG_PARTS[1]}
    VNUM3=$(echo ${TAG_PARTS[2]} | sed 's/[^0-9]*//g')

    # Format new tag
    NEW_TAG="$VNUM1.$VNUM2.$VNUM3-$WP_ENV"

    # Check that the new tag doesn't exist
    while [[ "${TAGS[@]}" =~ $NEW_TAG ]]
    do
      # Increment the tag by 0.0.1 as needed.
      VNUM3=$((VNUM3+1))
      NEW_TAG="$VNUM1.$VNUM2.$VNUM3-$WP_ENV"
    done

    break
  fi
done

if git tag $NEW_TAG; then
  echo "success: $NEW_TAG tag added."
  # git push --tags
else
  echo "error: $NEW_TAG was not added."
  exit 1
fi

