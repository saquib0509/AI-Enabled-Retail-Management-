package com.ro.petrol_pump_ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableScheduling
public class PetrolPumpAiApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetrolPumpAiApplication.class, args);
	}

}
