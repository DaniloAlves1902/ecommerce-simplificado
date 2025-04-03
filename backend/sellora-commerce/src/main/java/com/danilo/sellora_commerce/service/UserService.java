package com.danilo.sellora_commerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.danilo.sellora_commerce.dtos.UserDTO;
import com.danilo.sellora_commerce.exceptions.UserNotFoundException;
import com.danilo.sellora_commerce.model.User;
import com.danilo.sellora_commerce.repositories.UserRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Operation(summary = "Get all users", description = "Retrieve a list of all users in the system.")
    public List<UserDTO> findAll() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getDocument(),
                        user.getFullName(),
                        user.getUserType()))
                .collect(Collectors.toList());
    }

    @Operation(summary = "Find user by ID", description = "Retrieve a user by their ID.")
    @Parameter(name = "id", description = "ID of the user", required = true)
    public User findById(@Parameter(description = "User ID") Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found, please try again"));
    }

    @Operation(summary = "Find user by username", description = "Retrieve a user by their username.")
    @Parameter(name = "username", description = "Username of the user", required = true)
    public User findByUsername(@Parameter(description = "Username of the user") String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found, please try again"));
    }

    @Operation(summary = "Find user by email", description = "Retrieve a user by their email.")
    @Parameter(name = "email", description = "Email of the user", required = true)
    public User findByEmail(@Parameter(description = "Email of the user") String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found, please try again"));
    }

    @Operation(summary = "Find user by document", description = "Retrieve a user by their CPF or CNPJ document.")
    @Parameter(name = "document", description = "CPF or CNPJ of the user", required = true)
    public User findByDocument(@Parameter(description = "CPF or CNPJ of the user") String document) {
        return userRepository.findByDocument(document).orElseThrow(() -> new UserNotFoundException("User not found, please try again"));
    }

    @Operation(summary = "Save user", description = "Create or update a user.")
    @Parameter(name = "user", description = "User to be saved", required = true)
    public User save(@Parameter(description = "User to be saved") User user) {
        return userRepository.save(user);
    }

    @Operation(summary = "Delete user by ID", description = "Delete a user from the system by their ID.")
    @Parameter(name = "id", description = "ID of the user to be deleted", required = true)
    public void delete(@Parameter(description = "ID of the user to be deleted") Long id) {
        User user = findById(id);
        userRepository.delete(user);
    }

    @Operation(summary = "Update user", description = "Update a user in the system.")
    @Parameter(name = "user", description = "User to be updated", required = true)
    public User update(Long id, User user) {
        User existingUser = findById(user.getId());
        existingUser.setFullName(user.getFullName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhone(user.getPhone());
        existingUser.setUserType(user.getUserType());
        return userRepository.save(existingUser);
    }

}
