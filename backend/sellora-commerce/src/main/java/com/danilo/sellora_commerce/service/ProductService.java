package com.danilo.sellora_commerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.danilo.sellora_commerce.exceptions.ProductNotFoundException;
import com.danilo.sellora_commerce.model.Product;
import com.danilo.sellora_commerce.repositories.ProductRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Operation(summary = "Criar um novo produto", description = "Salva um novo produto no banco de dados")
    public Product createProduct(
            @Parameter(description = "Objeto do produto a ser criado", required = true) Product product) {
        return productRepository.save(product);
    }

    @Operation(summary = "Listar todos os produtos", description = "Retorna uma lista com todos os produtos cadastrados")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Operation(summary = "Buscar produto por ID", description = "Retorna um produto específico pelo seu ID")
    public Product getProductById(
            @Parameter(description = "ID do produto a ser encontrado", required = true) Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("Produto não encontrado com o ID: " + id));
    }

    @Operation(summary = "Atualizar um produto", description = "Atualiza os dados de um produto existente")
    public Product updateProduct(
            @Parameter(description = "ID do produto a ser atualizado", required = true) Long id,
            @Parameter(description = "Novos dados do produto", required = true) Product productDetails) {
        Product existingProduct = getProductById(id);
        existingProduct.setName(productDetails.getName());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setImageUrl(productDetails.getImageUrl());
        return productRepository.save(existingProduct);
    }

    @Operation(summary = "Excluir um produto", description = "Remove um produto existente do banco de dados pelo seu ID")
    public void deleteProduct(
            @Parameter(description = "ID do produto a ser deletado", required = true) Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
