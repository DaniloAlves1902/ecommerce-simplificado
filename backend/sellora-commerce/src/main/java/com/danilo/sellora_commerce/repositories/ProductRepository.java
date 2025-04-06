package com.danilo.sellora_commerce.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.danilo.sellora_commerce.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
}
