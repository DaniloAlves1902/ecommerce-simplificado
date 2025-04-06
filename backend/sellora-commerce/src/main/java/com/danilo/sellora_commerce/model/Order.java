package com.danilo.sellora_commerce.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.danilo.sellora_commerce.model.enums.OrderStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "orders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Schema(description = "Representa um pedido de compra")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único do pedido", example = "1001")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    @Schema(description = "Usuário que fez o pedido")
    private User user;

    @NotNull(message = "Total amount is required")
    @Schema(description = "Valor total do pedido", example = "299.90")
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Order status is required")
    @Schema(description = "Status do pedido", example = "PROCESSING")
    private OrderStatus status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "order-orderItems")
    @Schema(description = "Itens do pedido")
    private List<OrderItem> orderItems = new ArrayList<>();

    @Schema(description = "Data e hora do pedido", example = "2025-04-01T10:15:30")
    private LocalDateTime orderDate = LocalDateTime.now();

    /**
     * Adiciona um item ao pedido e atualiza o total.
     */
    public void addItem(OrderItem item) {
        orderItems.add(item);
        item.setOrder(this);
        recalculateTotal();
    }

    /**
     * Recalcula o valor total do pedido.
     */
    public void recalculateTotal() {
        this.totalAmount = orderItems.stream()
            .map(OrderItem::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
