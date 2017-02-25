HOSTDIR=./
REMOTEDIR=~/Projects/NetsecIoT/device-scanner
RSYNC_FLAG=-rt
REMOTE_ADDR=pi@6lbr
EXCLUDE=".*"

sync:
	rsync $(RSYNC_FLAG) --progress --exclude=$(EXCLUDE) $(HOSTDIR) $(REMOTE_ADDR):$(REMOTEDIR)