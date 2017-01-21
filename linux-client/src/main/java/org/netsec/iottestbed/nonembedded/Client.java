package org.netsec.iottestbed.nonembedded;

class TemperatureReader extends SensorReader {
    TemperatureReader(String address) {
        super(address, "temperature");
    }
}

class LEDController extends ActuatorController {
    LEDController(String addr) {
        super(addr, "led");
    }

    String on() throws InterruptedException {
       return sendCommand("ON");
    }

    String off() throws InterruptedException {
        return sendCommand("OFF");
    }
}

public class Client {
    public static void main(String[] args) throws InterruptedException {
        String boardAddress = "[fe80::5844:2342:656a:f846]";
        TemperatureReader temperatureReader = new TemperatureReader(boardAddress);
        LEDController ledController = new LEDController(boardAddress);
        int ctr = 0, time = 0;
        while (time++ < 20) {
            String putResponse;
            if (ctr == 0) {
                putResponse = ledController.on();
            } else {
                putResponse = ledController.off();
            }

            ctr = ~ctr;
            System.out.println("LED status: " + putResponse);
            System.out.println("temperature: " + temperatureReader.read());

            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
