echo "Clonning OpenShift console"

git clone git@github.com:openshift/console.git

echo "Copying plugin"

cp -Rf $(pwd)/rhoas-plugin ./console/frontend/packages/rhoas-plugin