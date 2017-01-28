function serviceStringParser(serviceString) {
    var raw_services = serviceString.split(",");
    var services = [];
    raw_services.pop();
    for (var i = 0; i < raw_services.length; i++) {
        var s = raw_services[i].split("|");
        var newService = {
            path: s[0], 
            method: s[1]
        };
        services.push(newService);
    }

    console.log(services);
    return services;
}

serviceStringParser("/actuator/led|4,/cli/stats|1,/sensor/temperature|1,");



