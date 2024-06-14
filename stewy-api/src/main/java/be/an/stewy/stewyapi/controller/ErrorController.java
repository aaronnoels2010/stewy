package be.an.stewy.stewyapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ErrorController {
    @GetMapping(value = "/errors")
    public void error(){
            throw new Error("dit is een test");
    }
}
