package com.danilo.sellora_commerce.controller;

import com.danilo.sellora_commerce.model.Product;
import com.danilo.sellora_commerce.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Produtos", description = "Operações relacionadas aos produtos")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Operation(summary = "Criar um novo produto", description = "Salva um novo produto no sistema")
    @PostMapping
    public ResponseEntity<Product> createProduct(
            @RequestBody @Parameter(description = "Produto a ser criado", required = true) Product product) {
        Product created = productService.createProduct(product);
        return ResponseEntity.status(201).body(created);
    }

    @Operation(summary = "Listar todos os produtos", description = "Retorna todos os produtos cadastrados")
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @Operation(summary = "Buscar produto por ID", description = "Retorna os dados de um produto específico")
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @PathVariable @Parameter(description = "ID do produto", required = true) Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @Operation(summary = "Atualizar produto", description = "Atualiza os dados de um produto existente")
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable @Parameter(description = "ID do produto", required = true) Long id,
            @RequestBody @Parameter(description = "Novos dados do produto", required = true) Product productDetails) {
        return ResponseEntity.ok(productService.updateProduct(id, productDetails));
    }

    @Operation(summary = "Deletar produto", description = "Remove um produto do sistema pelo ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable @Parameter(description = "ID do produto", required = true) Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
