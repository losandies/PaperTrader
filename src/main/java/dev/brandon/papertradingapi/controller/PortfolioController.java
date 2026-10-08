package dev.brandon.papertradingapi.controller;

import dev.brandon.papertradingapi.model.Portfolio;
import dev.brandon.papertradingapi.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PortfolioController {

    @GetMapping("accounts/{id}/portfolio")
    public ResponseEntity<Portfolio> getPortfolio(@PathVariable Long id) {
        return ResponseEntity.ok(portfolioService.getPortfolio(id));
    }




    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }
}