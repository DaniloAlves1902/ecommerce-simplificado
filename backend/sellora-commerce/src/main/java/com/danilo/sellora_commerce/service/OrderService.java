package com.danilo.sellora_commerce.service;

import com.danilo.sellora_commerce.model.Order;
import com.danilo.sellora_commerce.model.OrderItem;
import com.danilo.sellora_commerce.repositories.OrderRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Tag(name = "Pedidos", description = "Serviço para gerenciamento de pedidos")
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Operation(summary = "Buscar todos os pedidos")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Operation(summary = "Buscar pedido por ID")
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado com ID: " + id));
    }

    @Operation(summary = "Criar um novo pedido")
    public Order createOrder(Order order) {
        // Garante que o subtotal de cada item seja calculado
        for (OrderItem item : order.getOrderItems()) {
            item.setOrder(order);
            item.calculateSubtotal();
        }
        order.recalculateTotal();
        return orderRepository.save(order);
    }

    @Operation(summary = "Atualizar um pedido existente")
    public Order updateOrder(Long id, Order updatedOrder) {
        Order existing = getOrderById(id);

        existing.setUser(updatedOrder.getUser());
        existing.setStatus(updatedOrder.getStatus());
        existing.getOrderItems().clear();

        for (OrderItem item : updatedOrder.getOrderItems()) {
            item.setOrder(existing);
            item.calculateSubtotal();
            existing.addItem(item);
        }

        existing.recalculateTotal();
        return orderRepository.save(existing);
    }

    @Operation(summary = "Deletar um pedido")
    public void deleteOrder(Long id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }
}
