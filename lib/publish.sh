#!/bin/bash
set -e

TIP_COMMIT=$(git rev-parse HEAD)
echo $(printf "CircleCI commit: %s, Head commit: %s" $CIRCLE_SHA1 $TIP_COMMIT)

# make sure we only publish if we are at the head of master
if [[ $TIP_COMMIT != $CIRCLE_SHA1 ]]
then
  echo "Not on the tip of master!"
  exit 0
fi

# set npm credentials
echo "Setting up npm"
echo "//registry.npmjs.org/:_authToken=${NEWS_TOOLS_NPM_TOKEN}" > ./.npmrc

# bump versions, create change logs, create tags, publish to npm
PR_MSG=$(git log --pretty=format:"%h" -1)
MESSAGE=$(printf "chore: Publish %s [ci skip]" $PR_MSG)
echo $MESSAGE
npx lerna publish --conventional-commits --yes --concurrency=1 --exact -m "$MESSAGE"

# push above changes to git
echo "Pushing to master"
git config user.name "Publish Bot"
git config user.email "publish@ghbot.com"
git push origin master --tags --quiet > /dev/null 2>&1