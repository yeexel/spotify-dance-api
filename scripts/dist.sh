rm -rf dist
# If the directory, `dist`, doesn't exist, create `dist`
stat dist || mkdir dist
# Archive artifacts
PACKAGE_VERSION=$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')
zip dist/deploy.zip -r build package.json package-lock.json
