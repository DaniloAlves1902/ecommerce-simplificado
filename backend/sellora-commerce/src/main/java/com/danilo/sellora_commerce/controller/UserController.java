package com.danilo.sellora_commerce.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danilo.sellora_commerce.dtos.UserDTO;
import com.danilo.sellora_commerce.model.User;
import com.danilo.sellora_commerce.service.UserService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Operation(summary = "Get all users", description = "Retrieve a list of all users.")
    @GetMapping
    public List<UserDTO> getAllUsers() {
        logger.info("Fetching all users");
        List<UserDTO> users = userService.findAll();
        logger.info("Fetched {} users", users.size());
        return users;
    }

    @Operation(summary = "Find user by ID", description = "Retrieve a user by their ID.")
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        logger.info("Fetching user with ID: {}", id);
        User user = userService.findById(id);
        if (user != null) {
            logger.info("User found: {}", user);
        } else {
            logger.warn("User with ID {} not found", id);
        }
        return user;
    }

    @PostMapping
    public User saveUser(@RequestBody User user) {
        logger.info("Saving user: {}", user);
        User savedUser = userService.save(user);
        logger.info("User saved successfully with ID: {}", savedUser.getId());
        return savedUser;
    }
}