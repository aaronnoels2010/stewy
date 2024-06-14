package be.an.stewy.stewyapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StewyApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(StewyApiApplication.class, args);
    }

}
