package dev.brandon.papertradingapi.service;

import dev.brandon.papertradingapi.model.Account;
import dev.brandon.papertradingapi.model.Holding;
import dev.brandon.papertradingapi.model.SellPreview;
import dev.brandon.papertradingapi.model.Trade;
import dev.brandon.papertradingapi.model.TradeResponse;
import dev.brandon.papertradingapi.model.TradeType;
import dev.brandon.papertradingapi.repository.AccountRepository;
import dev.brandon.papertradingapi.repository.HoldingRepository;
import dev.brandon.papertradingapi.repository.TradeRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class TradingService {
    private final AccountRepository accountRepository;
    private final HoldingRepository holdingRepository;
    private final TradeRepository tradeRepository;
    private final StockService stockService;

    public TradingService(AccountRepository accountRepository, HoldingRepository holdingRepository, StockService stockService, TradeRepository tradeRepository) {
        this.accountRepository = accountRepository;
        this.stockService = stockService;
        this.holdingRepository = holdingRepository;
        this.tradeRepository = tradeRepository;
    }

    public List<TradeResponse> getTradeHistory(Long accountId) {
        Account account = accountRepository.findById(accountId).orElseThrow();
        List<Trade> tradeHistory =  tradeRepository.findByAccountOrderByExecutedAtDesc(account);

        List<TradeResponse> trades = new ArrayList<>();

        for (Trade trade : tradeHistory) {
            TradeResponse response = new TradeResponse(
                trade.getId(),
                trade.getSymbol(),
                trade.getType(),
                trade.getQuantity(),
                trade.getExecutionPrice(),
                trade.getRealizedPL(),
                trade.getExecutedAt()
            );
            trades.add(response);
        }

        return trades;
    }

    @Transactional
    public Holding buyStock(Long accountId, String symbol, BigDecimal quantity) {
        symbol = symbol.trim().toUpperCase(Locale.ROOT);
        Account account = accountRepository.findById(accountId).orElseThrow();
        BigDecimal accountBalance = account.getCashBalance();

        BigDecimal currentPrice = stockService.getPrice(symbol).getPrice();
        BigDecimal orderCost = currentPrice.multiply(quantity);

        if (quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }


        if (accountBalance.compareTo(orderCost) < 0) {
            throw new IllegalArgumentException("Insufficient Funds");
        } else {
            Optional<Holding> holding = holdingRepository.findByAccountAndSymbol(account, symbol);

            Holding purchasedHolding;

            if (holding.isPresent()) {
                Holding existingHolding = holding.get();
                BigDecimal currentQuantity = existingHolding.getQuantity();
                BigDecimal currentAverageCost = existingHolding.getAverageCost();
                BigDecimal currentPositionValue = currentQuantity.multiply(currentAverageCost);
                BigDecimal newQuantity = currentQuantity.add(quantity);
                BigDecimal newTotalHolding = currentPositionValue.add(orderCost);
                BigDecimal newAverageCost = newTotalHolding.divide(newQuantity, 4, RoundingMode.HALF_UP);

                existingHolding.setAverageCost(newAverageCost);
                existingHolding.setQuantity(newQuantity);

                holdingRepository.save(existingHolding);

                purchasedHolding = existingHolding;

            } else {
                Holding newHolding = new Holding(account, symbol, quantity, currentPrice);
                holdingRepository.save(newHolding);

                purchasedHolding = newHolding;
            }

            

            BigDecimal newAccountBalance = accountBalance.subtract(orderCost);
            account.setCashBalance(newAccountBalance);
            Trade trade = new Trade(account, symbol, TradeType.BUY, quantity, currentPrice, null);

            tradeRepository.save(trade);
            accountRepository.save(account);
            return purchasedHolding;
        }
    }

    @Transactional
    public void sellStock(Long accountId, String symbol, BigDecimal quantity) {
        symbol = symbol.trim().toUpperCase(Locale.ROOT);
        Account account = accountRepository.findById(accountId).orElseThrow();

        Optional<Holding> holding = holdingRepository.findByAccountAndSymbol(account, symbol);

        if (holding.isPresent()) {
            Holding existingHolding = holding.get();
            BigDecimal currentQuantity = existingHolding.getQuantity();

            if (quantity.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than zero");
            }

            if (currentQuantity.compareTo(quantity) < 0) {
                throw new IllegalArgumentException("Quantity is higher than amount owned");
            }


            BigDecimal currentPrice = stockService.getPrice(symbol).getPrice();
            BigDecimal saleProceeds = currentPrice.multiply(quantity);
            BigDecimal newQuantity = currentQuantity.subtract(quantity);

            if(newQuantity.compareTo(BigDecimal.ZERO) > 0) {
                existingHolding.setQuantity(newQuantity);
                holdingRepository.save(existingHolding);
            } else {
                holdingRepository.delete(existingHolding);
            }

            BigDecimal realizedPL = currentPrice
            .subtract(existingHolding.getAverageCost())
            .multiply(quantity);


            account.setCashBalance(account.getCashBalance().add(saleProceeds));
            Trade trade = new Trade(account, symbol, TradeType.SELL, quantity, currentPrice, realizedPL);
            
            tradeRepository.save(trade);

            accountRepository.save(account);

        } else {
            throw new IllegalArgumentException("You do not own this stock");
        }

    }

    public SellPreview previewSale(Long accountId, String symbol, BigDecimal quantity) {
        symbol = symbol.trim().toUpperCase(Locale.ROOT);
        Account account = accountRepository.findById(accountId).orElseThrow();

        Optional<Holding> holding = holdingRepository.findByAccountAndSymbol(account, symbol);


        if (holding.isPresent()) {
            Holding existingHolding = holding.get();
            BigDecimal currentQuantity = existingHolding.getQuantity();

            if (quantity.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Quantity must be greater than zero");
            }

            if (currentQuantity.compareTo(quantity) < 0) {
                throw new IllegalArgumentException("Quantity is higher than amount owned");
            }


            BigDecimal currentPrice = stockService.getPrice(symbol).getPrice();
            BigDecimal saleProceeds = currentPrice.multiply(quantity);

            return new SellPreview(symbol, quantity, currentPrice, saleProceeds);


        } else {
            throw new IllegalArgumentException("You do not own this stock");
        }
    }

}