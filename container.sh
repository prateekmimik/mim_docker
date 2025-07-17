PORTMAP=$1
NETWORKNAME=$2

if [ -z "$PORTMAP" ]; then
  echo "please provide port mapping (e.g. host_port:container_port)"
  exit 1
fi

PORTMAP="-p $PORTMAP"

RUNCMD=""
echo "creating container"
if [ -z "$NETWORKNAME" ]; then
  RUNCMD="docker run -idt $PORTMAP --name mimoe-new mimoe-new"
else
  RUNCMD="docker run --network $NETWORKNAME -idt $PORTMAP --name mimoe-new mimoe-new"
fi

echo $RUNCMD
eval $RUNCMD