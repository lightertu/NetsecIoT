# How to Compile and Flash RIOT Application Onto Your Board

## To Compile
#### Step 1, Find your compiler
For Atmel SAM R21 we use the [gcc-arm-embedded toolchain](https://launchpad.net/gcc-arm-embedded/+download). In our case we choose [gcc-arm-none-eabi-4_9-2015q2](https://launchpad.net/gcc-arm-embedded/4.9/4.9-2015-q2-update/+download/gcc-arm-none-eabi-4_9-2015q2-20150609-linux.tar.bz2). 
The package can be decompressed using 
```bash
tar xvfj gcc-arm-none-eabi-4_9-2015q2-20150609-linux.tar.bz2
```

Then add it to your `PATH`
```bash
export PATH=${PATH}:~/path/to/gcc-arm-none-eabi-5_2-2015q4/arm-none-eabi
```

#### Step 2, Copy a template application from RIOT
```bash
cp -R /path/to/RIOT/examples/default /path/to/YourApplicationName
```

#### Step 3, Configure the Makefile in your Application
* Change the board name, change this line to:
  ```
  BOARD ?= samr21-xpro
  ```
* Change RIOT base directory by modifying the line to:
  ```
  RIOTBASE ?= /path/to/RIOT
  ```
#### Step 4, make
```bash
make
```

##To Flash


