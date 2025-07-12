TOKEN=$1
if [ -z "$TOKEN" ]; then
  echo "missing token"
  exit 1
fi
CURLCMD="curl -s -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -X GET http://172.25.1.251:7083/clientId/minsight/v1/nodes?ownerCode=626393e7-b6b2-4a72-893c-5da07b554250&type=network"
echo "########"
echo "Command:"
echo $CURLCMD
echo "########"
echo "Output:"
CURLRESULT=$(eval $CURLCMD | jq -r '.data[] | { id, url }')
echo $CURLRESULT
echo "########"