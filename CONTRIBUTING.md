## Contributing

Plugin can be integrated with OpenShift console.
https://github.com/openshift/console

## Local development 

1. Execute script to setup your dev env

./scripts/devSetup.sh

2. Open Editor on console project.
For example `Code ./console`

3. rhoas-plugin should be in `console/frontend/packages/rhoas-plugin`

4. Development and builds should be done inside openshift repository because 
we need packages that are only available inside the mono repostory.

5. Add plugin package to console

Add dependency "@console/rhoas-plugin": "0.0.0-fixed", to the `console-app/package.json`

6. Execute `yarn install`  in the console/frontend.

7. Run the bridge (./bin/bridge)

8. Run `yarn dev` in console/frontend.

9. Open http://0.0.0.0:9000/


##  Fixing problems with symlink

You can copy plugin:

```
cp -Rf $(pwd)/rhoas-plugin ./console/frontend/packages/rhoas-plugin
```


Since plugin was copied to openshift repository we need to extract it back to the original repo:


or
```
cp -Rf ./console/frontend/packages/rhoas-plugin $(pwd)/rhoas-plugin 
```



