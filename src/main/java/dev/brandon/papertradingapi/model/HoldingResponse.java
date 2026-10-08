package dev.brandon.papertradingapi.model;

import java.math.BigDecimal;

public class HoldingResponse {
    private String symbol;
    private BigDecimal quantity;
    private BigDecimal averageCost;

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

    public HoldingResponse(String symbol, BigDecimal quantity, BigDecimal averageCost) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.averageCost = averageCost;
    }
}