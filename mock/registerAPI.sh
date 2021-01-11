echo "Registering CRD's on cluster"

oc apply -f -n openshift ./crds/ManagedKafkaConnection.yml       
oc apply -f -n openshift ./crds/ManagedKafkaRequest.yml          
oc apply -f -n openshift ./crds/ManagedServiceAccountRequest.yml

echo "Plugin can be used now. Create ManagedKafkaRequest CR"
