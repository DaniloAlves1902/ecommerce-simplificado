package com.danilo.sellora_commerce.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @Operation(summary = "Find user by username", description = "Retrieve a user by their username.")
    @GetMapping("/username/{username}")
    public User getUserByUsername(@PathVariable String username) {
        logger.info("Fetching user with username: {}", username);
        User user = userService.findByUsername(username);
        if (user != null) {
            logger.info("User found: {}", user);
        } else {
            logger.warn("User with username {} not found", username);
        }
        return user;
    }

    @Operation(summary = "Find user by email", description = "Retrieve a user by their email.")
    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        logger.info("Fetching user with email: {}", email);
        User user = userService.findByEmail(email);
        if (user != null) {
            logger.info("User found: {}", user);
        } else {
            logger.warn("User with email {} not found", email);
        }
        return user;
    }

    @Operation(summary = "Find user by document", description = "Retrieve a user by their CPF or CNPJ document.")
    @GetMapping("/document/{document}")
    public User getUserByDocument(@PathVariable String document) {
        logger.info("Fetching user with document: {}", document);
        User user = userService.findByDocument(document);
        if (user != null) {
            logger.info("User found: {}", user);
        } else {
            logger.warn("User with document {} not found", document);
        }
        return user;    
    }

    @Operation(summary = "Delete user by ID", description = "Delete a user from the system by their ID.")
    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Long id) {
        logger.info("Deleting user with ID: {}", id);
        userService.delete(id);
        logger.info("User deleted successfully");
    }

    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        logger.info("Updating user with ID: {}", id);
        user.setId(id);
        return userService.update(id, user);
    }


}