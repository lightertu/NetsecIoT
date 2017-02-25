HOSTDIR=./
REMOTEDIR=~/Projects/6lowpan_testbed/client-apps/Non-Embedded/coap-client
RSYNC_FLAG=-rt
REMOTE_ADDR=pi@192.168.1.218
EXCLUDE=".*"

all:
	mvn compile

clean:
	mvn clean

sync:
	rsync $(RSYNC_FLAG) --progress --exclude=$(EXCLUDE) $(HOSTDIR) $(REMOTE_ADDR):$(REMOTEDIR)