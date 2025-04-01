package com.danilo.sellora_commerce.model;

import java.time.LocalDateTime;
//import java.util.List;

import com.danilo.sellora_commerce.model.enums.UserType;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Representa um usuário do sistema de e-commerce.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "password") 
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único do usuário", example = "1")
    private Long id;

    @NotBlank(message = "Full name is required")
    @Schema(description = "Nome completo do usuário", example = "Danilo Alves")
    private String fullName;

    @Column(unique = true)
    @NotBlank(message = "Username is required")
    @Schema(description = "Nome de usuário único", example = "danilo123")
    private String username;

    @Column(unique = true)
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Schema(description = "Endereço de e-mail do usuário", example = "danilo@email.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Schema(description = "Senha do usuário (criptografada)", example = "******")
    private String password;

    @Column(unique = true)
    @NotBlank(message = "Phone is required")
    @Schema(description = "Número de telefone do usuário", example = "+55 11 91234-5678")
    private String phone;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "User type is required")
    @Schema(description = "Tipo de usuário", example = "CUSTOMER")
    private UserType userType;

    @NotBlank(message = "CPF/CNPJ is required")
    @Pattern(regexp = "\\d{11}|\\d{14}", message = "Document must be 11 (CPF) or 14 (CNPJ) digits")
    @Column(unique = true)
    @Schema(description = "CPF ou CNPJ do usuário (apenas números)", example = "12345678909")
    private String document; 

    @Embedded
    @Schema(description = "Endereço do usuário")
    private Address address;

    @Schema(description = "Indica se o usuário está ativo ou inativo", example = "true")
    private Boolean status = true;

    @Schema(description = "Data e hora de criação do usuário", example = "2025-03-30T14:30:00")
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Define o CPF ou CNPJ armazenando apenas os números.
     * Remove caracteres não numéricos.
     * 
     * @param document CPF ou CNPJ do usuário
     */
    public void setDocument(String document) {
        this.document = document != null ? document.replaceAll("\\D", "") : null;
    }
}
