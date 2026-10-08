package dev.brandon.papertradingapi.model;

import java.math.BigDecimal;
import java.util.List;

public class Portfolio {
    public BigDecimal getCashBalance() {
        return cashBalance;
    }

    public void setCashBalance(BigDecimal cashBalance) {
        this.cashBalance = cashBalance;
    }

    public List<HoldingResponse> getHoldings() {
        return holdings;
    }

    public void setHoldings(List<HoldingResponse> holdings) {
        this.holdings = holdings;
    }

    private BigDecimal cashBalance;
    private List<HoldingResponse> holdings;

    public Portfolio(BigDecimal cashBalance, List<HoldingResponse> holdings) {
        this.cashBalance = cashBalance;
        this.holdings = holdings;
    }
}