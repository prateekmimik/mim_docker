NETWORKNAME=$1
PORTMAP=$2

if [ -z "$PORTMAP" ]; then
  PORTMAP=""
else
  PORTMAP="-p $PORTMAP"
fi

RUNCMD=""
echo "creating container"
if [ -z "$NETWORKNAME" ]; then
  RUNCMD="docker run -idt $PORTMAP --name mimoe-new mimoe-new"
else
  RUNCMD="docker run --network $NETWORKNAME -idt $PORTMAP --name mimoe-new mimoe-new"
fi

echo $RUNCMD
eval $RUNCMD