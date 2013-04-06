#/bin/sh

execPath=$(dirname $0)

node $execPath/app.js > /tmp/nodeRPG.log &
exit