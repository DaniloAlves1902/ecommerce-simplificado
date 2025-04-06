package com.danilo.sellora_commerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.danilo.sellora_commerce.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
}
