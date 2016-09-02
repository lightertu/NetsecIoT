# How to Compile and Flash RIOT Application Onto Your Board

## To Compile

#### Step 1, Copy a template application from RIOT
```bash
cp -R /path/to/RIOT/examples/default /path/to/YourApplicationName
```

#### Step 2, Configure the Makefile in your Application
* Change the board name, change this line to:
  ```
  BOARD ?= samr21-xpro
  ```
* Change RIOT base directory by modifying the line to:
  ```
  RIOTBASE ?= /path/to/RIOT
  ```

#### Step 3, Compile
```bash
make
```

##To Flash
####Preparation
In order to be able to flash the application onto the board without root privileges, a couple of additional customizations are necessary. First we need to add our user do the dialout group by running the following command:
```
sudo usermod --append --groups dialout <our username>
```

Secondly we need to instruct udev, the device manager, to allow access to the kernel devices created by the hidapi. We do this by creating a new file ``99-hidraw-permissions.rules` in the `/etc/udev/rules.d` directory with the following content:
```
KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0664", GROUP="plugdev"
```

####Flashing
We need two terminals instances to do this, in the application base direcotry in the first terminal issue:
```
make && make term
```
A serial port terminal emulator written in Python, listening to the output of the board:
```
INFO # Connect to serial port /dev/ttyACM0
Welcome to pyterm!
Type '/exit' to exit.
```

In the second terminal we flash the code to the board
```
make flash
```
`make flash` flashes and subsequently resets the board, causing the application to run. For our hello world example it should result in the following output being shown in the terminal window in which `make term` was executed:

```
INFO # kernel_init(): This is RIOT! (Version: 2014.12-285-gfe295)
INFO # kernel_init(): jumping into first task...
INFO # Hello World!
INFO # You are running RIOT on a(n) samr21-xpro board.
INFO # This board features a(n) samd21 MCU.
```

