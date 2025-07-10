NETWORK_NAME=$1
if [ -z "$NETWORK_NAME" ]; then
  docker run -idt --name mimoe-new mimoe-new
else
  docker run --network "$NETWORK_NAME" -idt --name mimoe-new mimoe-new
fi