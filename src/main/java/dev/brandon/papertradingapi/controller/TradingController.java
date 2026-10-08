package dev.brandon.papertradingapi.controller;

import dev.brandon.papertradingapi.model.Holding;
import dev.brandon.papertradingapi.model.SellPreview;
import dev.brandon.papertradingapi.service.AccountService;
import dev.brandon.papertradingapi.service.TradingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
public class TradingController {
    private final TradingService tradingService;

    public TradingController(TradingService tradingService) {
        this.tradingService = tradingService;
    }

    @PostMapping("accounts/{id}/buy")
    public ResponseEntity<Holding> buyStock(@PathVariable Long id, @RequestParam String symbol, @RequestParam BigDecimal quantity) {
        return ResponseEntity.ok(tradingService.buyStock(id,symbol, quantity));
    }
    @PostMapping("accounts/{id}/sell")
    public ResponseEntity<Void> sellStock(@PathVariable Long id, @RequestParam String symbol, @RequestParam BigDecimal quantity) {
        tradingService.sellStock(id, symbol, quantity);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("accounts/{id}/sell/preview")
    public ResponseEntity<SellPreview> previewSale(@PathVariable Long id, @RequestParam String symbol, @RequestParam BigDecimal quantity) {
        return ResponseEntity.ok(tradingService.previewSale(id, symbol, quantity));

    }
}