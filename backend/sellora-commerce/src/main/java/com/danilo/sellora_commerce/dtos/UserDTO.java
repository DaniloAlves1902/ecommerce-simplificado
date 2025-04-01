package com.danilo.sellora_commerce.dtos;

import com.danilo.sellora_commerce.model.enums.UserType;
public record UserDTO(
    String username,
    String email,
    String phone,
    String document,
    String fullName,
    UserType userType
) {
    
}
