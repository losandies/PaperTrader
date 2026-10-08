package dev.brandon.papertradingapi.model;

import java.math.BigDecimal;

public class StockPrice {
    private BigDecimal price;

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public StockPrice() {

    }
}