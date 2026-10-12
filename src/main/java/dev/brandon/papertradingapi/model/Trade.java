package dev.brandon.papertradingapi.model;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.annotation.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity 
public class Trade {
    
    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;
    private String symbol;
    private BigDecimal quantity;
    private BigDecimal executionPrice;
    @Nullable 
    private BigDecimal realizedPL;
    
    public BigDecimal getRealizedPL() {
        return realizedPL;
    }

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

    public BigDecimal getExecutionPrice() {
        return executionPrice;
    }

    public void setExecutionPrice(BigDecimal executionPrice) {
        this.executionPrice = executionPrice;
    }

    public Instant getExecutedAt() {
        return executedAt;
    }

    public void setExecutedAt(Instant executedAt) {
        this.executedAt = executedAt;
    }

    public TradeType getType() {
        return type;
    }

    public void setType(TradeType type) {
        this.type = type;
    }

    private Instant executedAt;

    @Enumerated(EnumType.STRING)
    private TradeType type;

    public Trade() {

    }

    public Trade(Account account, String symbol, TradeType type, BigDecimal quantity, BigDecimal executionPrice, BigDecimal realizedPL) {
        this.account = account;
        this.symbol = symbol;
        this.quantity = quantity;
        this.type = type;
        this.executionPrice = executionPrice;
        this.realizedPL = realizedPL;
        this.executedAt = Instant.now();
    }

}
