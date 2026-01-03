package com.IndiChess.Controller;

import com.IndiChess.Model.User;
import com.IndiChess.Repository.UserRepository;
import com.IndiChess.Security.JwtUtil;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserRepository repository;
    private final PasswordEncoder encoder;

    public AuthController(AuthenticationManager authManager,
                          JwtUtil jwtUtil,
                          UserRepository repository,
                          PasswordEncoder encoder) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.repository = repository;
        this.encoder = encoder;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return repository.save(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        user.getPassword()
                )
        );

        return jwtUtil.generateToken(user.getEmail());
    }

    @GetMapping("/testing")
    public String testing() {
        return "Access Granted";
    }
}
