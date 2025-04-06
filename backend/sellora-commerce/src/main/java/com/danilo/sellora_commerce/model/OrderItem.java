package com.danilo.sellora_commerce.model;

import java.math.BigDecimal;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonBackReference;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Schema(description = "Representa um item dentro de um pedido, associando um produto e sua quantidade")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único do item do pedido", example = "101")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference(value = "order-orderItems")
    @Schema(description = "Pedido ao qual este item pertence")
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonBackReference(value = "product-orderItems")
    @Schema(description = "Produto associado a este item do pedido")
    private Product product;

    @NotNull(message = "Quantity is required")
    @Schema(description = "Quantidade do produto neste pedido", example = "2")
    private Integer quantity;

    @NotNull(message = "Subtotal is required")
    @Schema(description = "Subtotal calculado com base no preço do produto e quantidade", example = "199.98")
    private BigDecimal subtotal;

    /**
     * Calcula o subtotal do item do pedido com base no preço do produto e quantidade.
     */
    public void calculateSubtotal() {
        if (product != null && product.getPrice() != null && quantity != null) {
            this.subtotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
        }
    }
}
