package com.danilo.sellora_commerce.model;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class Address {
    private String street;
    private String number;
    private String city;
    private String state;
    private String country;
    private String zipCode;
}
