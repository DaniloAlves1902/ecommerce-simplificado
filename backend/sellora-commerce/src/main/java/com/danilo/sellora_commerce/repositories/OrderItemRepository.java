package com.danilo.sellora_commerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.danilo.sellora_commerce.model.OrderItem;
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
}
