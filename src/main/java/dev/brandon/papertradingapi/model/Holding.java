package dev.brandon.papertradingapi.model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity @Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"account_id", "symbol"})
})
public class Holding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;
    private String symbol;
    private BigDecimal quantity;
    @Column(precision = 19, scale = 4)
    private BigDecimal averageCost;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getAverageCost() {
        return averageCost;
    }

    public void setAverageCost(BigDecimal averageCost) {
        this.averageCost = averageCost;
    }

    public Holding(Account account, String symbol, BigDecimal quantity, BigDecimal averageCost) {
        this.account = account;
        this.symbol = symbol;
        this.quantity = quantity;
        this.averageCost = averageCost;
    }

    public Holding() {

    }
}