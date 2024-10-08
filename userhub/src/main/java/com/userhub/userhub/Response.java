package com.userhub.userhub;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Response {
    @RequestMapping("/")
    public String WelcomePage() {
        return "Server is runing on port 8080";
    }
}
