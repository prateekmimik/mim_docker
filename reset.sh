echo "reset container"
docker container stop mimoe-new && docker container rm mimoe-new
echo "reset image"
docker image rm mimoe-new