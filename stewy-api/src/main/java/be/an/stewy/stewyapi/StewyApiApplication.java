package be.an.stewy.stewyapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication( exclude = SecurityAutoConfiguration.class)
public class StewyApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(StewyApiApplication.class, args);
    }

}