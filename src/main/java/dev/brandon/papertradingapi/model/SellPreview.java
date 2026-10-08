package dev.brandon.papertradingapi.model;

import java.math.BigDecimal;

public class SellPreview {

    private String symbol;
    private BigDecimal quantity;
    private BigDecimal price;

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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getEstimatedProceeds() {
        return estimatedProceeds;
    }

    public void setEstimatedProceeds(BigDecimal estimatedProceeds) {
        this.estimatedProceeds = estimatedProceeds;
    }

    private BigDecimal estimatedProceeds;

    public SellPreview(String symbol, BigDecimal quantity, BigDecimal price, BigDecimal estimatedProceeds) {
        this.symbol = symbol;
        this.quantity = quantity;
        this.price = price;
        this.estimatedProceeds = estimatedProceeds;

    }
}