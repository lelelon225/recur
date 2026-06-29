package ch.noseryoung.domain;

import org.springframework.boot.SpringApplication;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RestController
public class RecurApplication {

    public static void main(String[] args) {
        SpringApplication.run(RecurApplication.class, args);
    }
}