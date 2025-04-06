package com.danilo.sellora_commerce.controller;

import com.danilo.sellora_commerce.model.OrderItem;
import com.danilo.sellora_commerce.service.OrderItemService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@Tag(name = "Order Items", description = "Endpoints para manipulação de itens de pedidos")
public class OrderItemController {

    @Autowired
    private OrderItemService orderItemService;

    @GetMapping
    @Operation(summary = "Listar todos os itens de pedidos")
    public ResponseEntity<List<OrderItem>> getAll() {
        return ResponseEntity.ok(orderItemService.getAllOrderItems());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar item de pedido por ID")
    public ResponseEntity<OrderItem> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderItemService.getOrderItemById(id));
    }

    @PostMapping
    @Operation(summary = "Criar um novo item de pedido")
    public ResponseEntity<OrderItem> create(@RequestBody OrderItem orderItem) {
        return ResponseEntity.ok(orderItemService.createOrderItem(orderItem));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar um item de pedido")
    public ResponseEntity<OrderItem> update(@PathVariable Long id, @RequestBody OrderItem updatedItem) {
        return ResponseEntity.ok(orderItemService.updateOrderItem(id, updatedItem));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar um item de pedido por ID")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderItemService.deleteOrderItem(id);
        return ResponseEntity.noContent().build();
    }
}
