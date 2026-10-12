package dev.brandon.papertradingapi.model;

import java.math.BigDecimal;
import java.time.Instant;

public class TradeResponse {
    private Long id;
    private String symbol;
    private TradeType type;
    private BigDecimal quantity;
    private BigDecimal executionPrice;
    private BigDecimal realizedPL;

    public BigDecimal getRealizedPL() {
        return realizedPL;
    }

    private Instant executedAt;
    
    public Long getId() {
        return id;
    }

    public String getSymbol() {
        return symbol;
    }

    public TradeType getType() {
        return type;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public BigDecimal getExecutionPrice() {
        return executionPrice;
    }

    public Instant getExecutedAt() {
        return executedAt;
    }

    public TradeResponse(Long id, String symbol, TradeType type, BigDecimal quantity, BigDecimal executionPrice, BigDecimal realizedPL, Instant executedAt) {
        this.id = id;
        this.symbol = symbol;
        this.type = type;
        this.quantity = quantity;
        this.executionPrice = executionPrice;
        this.realizedPL = realizedPL;
        this.executedAt = executedAt;
    }

}
