package dev.brandon.papertradingapi.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.math.BigDecimal;

@Entity
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private BigDecimal cashBalance;

    public Account() {


    }

    public Account(String username, BigDecimal cashBalance) {
        this.username = username;
        this.cashBalance = cashBalance;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setUsername(String username){
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setCashBalance(BigDecimal cashBalance){
        this.cashBalance = cashBalance;
    }

    public BigDecimal getCashBalance() {
        return cashBalance;
    }
}