package com.danilo.sellora_commerce.service;

import com.danilo.sellora_commerce.model.OrderItem;
import com.danilo.sellora_commerce.repositories.OrderItemRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Service
@Tag(name = "Order Items", description = "Operações relacionadas aos itens de pedidos")
public class OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Operation(summary = "Listar todos os itens de pedidos", description = "Retorna todos os itens de pedidos cadastrados")
    public List<OrderItem> getAllOrderItems() {
        return orderItemRepository.findAll();
    }

    @Operation(summary = "Buscar item de pedido por ID")
    public OrderItem getOrderItemById(Long id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found with ID: " + id));
    }

    @Operation(summary = "Criar um novo item de pedido")
    public OrderItem createOrderItem(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    @Operation(summary = "Atualizar um item de pedido")
    public OrderItem updateOrderItem(Long id, OrderItem updatedItem) {
        OrderItem existing = getOrderItemById(id);
        existing.setOrder(updatedItem.getOrder());
        existing.setProduct(updatedItem.getProduct());
        existing.setQuantity(updatedItem.getQuantity());
        existing.calculateSubtotal(); // atualiza subtotal
        return orderItemRepository.save(existing);
    }

    @Operation(summary = "Deletar um item de pedido por ID")
    public void deleteOrderItem(Long id) {
        OrderItem item = getOrderItemById(id);
        orderItemRepository.delete(item);
    }
}
