## Contributing

Plugin can be integrated with OpenShift console.
https://github.com/openshift/console

## Local development 

1. Execute script to setup your dev env

./scripts/devSetup.sh

2. Follow console/README.md to run OpenShift Console in the dev mode

3. Open Editor on console project.
For example `Code ./console`

4. rhoas-plugin should be in `console/frontend/packages/rhoas-plugin`

5. Development and builds should be done inside openshift repository because 
we need packages that are only available inside the mono repostory.

## Pushing changes back

Since plugin was copied to openshift repository we need to extract it back to the original repo:

```
cp -Rf ./console/frontend/packages/rhoas-plugin $(pwd)/rhoas-plugin 
```