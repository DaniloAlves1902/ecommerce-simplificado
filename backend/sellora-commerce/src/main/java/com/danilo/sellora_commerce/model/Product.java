package com.danilo.sellora_commerce.model;

import java.math.BigDecimal;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Schema(description = "Representa um produto disponível para venda")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único do produto", example = "1")
    private Long id;

    @NotBlank(message = "Product name is required")
    @Schema(description = "Nome do produto", example = "Smartphone Samsung Galaxy S22")
    private String name;

    @NotNull(message = "Price is required")
    @Schema(description = "Preço do produto", example = "2999.90")
    private BigDecimal price;

    @Schema(description = "Descrição detalhada do produto", example = "Smartphone com tela AMOLED de 6.1 polegadas e 128GB de armazenamento")
    private String description;

    @Schema(description = "URL da imagem do produto", example = "https://meusite.com/imagens/produto123.jpg")
    private String imageUrl;
}
