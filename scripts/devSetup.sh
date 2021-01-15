echo "Clonning OpenShift console"

git clone git@github.com:openshift/console.git

echo "Copying plugin"

ln -s $(pwd)/rhoas-plugin ./console/frontend/packages/rhoas-plugin