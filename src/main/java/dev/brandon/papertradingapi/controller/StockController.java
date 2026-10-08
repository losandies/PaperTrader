package dev.brandon.papertradingapi.controller;

import dev.brandon.papertradingapi.model.Quote;
import dev.brandon.papertradingapi.model.StockPrice;
import dev.brandon.papertradingapi.service.StockService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StockController {
    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }


    @GetMapping("stocks/{symbol}")
    public Quote getQuote(@PathVariable String symbol) {
        return stockService.getQuote(symbol);
    }

    @GetMapping("stocks/{symbol}/price")
    public StockPrice getPrice(@PathVariable String symbol) {
        return stockService.getPrice(symbol);
    }
}