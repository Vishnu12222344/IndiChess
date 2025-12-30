package com.IndiChess.Controller;

import com.IndiChess.Model.User;
import com.IndiChess.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {

    @Autowired
    private UserRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/")
    public String helloWorld() {
        return "Hello World";
    }
    @GetMapping("/register")
    public String registerUser() {
        return "user Successfully registered";
    }
    @GetMapping("/testing")
    public String testingUser() {
        return "Access Granted";
    }

//    @PostMapping("/register")
//    public User registerUser(@RequestBody User user) {
//
//        // encode password before saving
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//
//        return repository.save(user);
//    }
}
