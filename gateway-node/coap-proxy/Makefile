HOSTDIR=./
REMOTEDIR=~/Projects/NetsecIoT/gateway-node/coap-proxy
RSYNC_FLAG=-rt
REMOTE_ADDR=pi@6lbr
EXCLUDE=".*"

all:
	mvn compile

clean:
	mvn clean

sync:
	rsync $(RSYNC_FLAG) --progress --exclude=$(EXCLUDE) $(HOSTDIR) $(REMOTE_ADDR):$(REMOTEDIR)
