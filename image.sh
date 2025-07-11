echo "creating image"
RUNCMD="docker build -t mimoe-new ."
echo $RUNCMD
eval $RUNCMD