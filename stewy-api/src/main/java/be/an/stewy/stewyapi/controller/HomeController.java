package be.an.stewy.stewyapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping(value = "/hello")
    public String Home() {
        return "Hello World!";
    }
}
