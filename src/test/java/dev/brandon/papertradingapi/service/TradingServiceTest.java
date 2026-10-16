package dev.brandon.papertradingapi.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import dev.brandon.papertradingapi.model.Account;
import dev.brandon.papertradingapi.model.Holding;
import dev.brandon.papertradingapi.model.StockPrice;
import dev.brandon.papertradingapi.model.Trade;
import dev.brandon.papertradingapi.repository.AccountRepository;
import dev.brandon.papertradingapi.repository.HoldingRepository;
import dev.brandon.papertradingapi.repository.TradeRepository;

@ExtendWith(MockitoExtension.class)
public class TradingServiceTest {
    @Mock 
    AccountRepository accountRepository;
    @Mock
    HoldingRepository holdingRepository;
    @Mock
    TradeRepository tradeRepository;
    @Mock
    StockService stockService;

    @InjectMocks
    private TradingService tradingService;

    @Test
    void buyStockCreatesHoldingAndDeductsCash() {
        Account account = new Account("test-user", new BigDecimal(1000.00));

        account.setId(1L);

        when(accountRepository.findById(1L)).thenReturn(Optional.of(account));

        StockPrice stockPrice = new StockPrice();

        stockPrice.setPrice(new BigDecimal(100.00));

        when(stockService.getPrice("AAPL")).thenReturn(stockPrice);

        when(holdingRepository.findByAccountAndSymbol((account), "AAPL")).thenReturn(Optional.empty());

        Holding result = tradingService.buyStock(1L, "AAPL", new BigDecimal(3));

        assertEquals("AAPL", result.getSymbol());

        assertEquals(0, new BigDecimal("700.00").compareTo(account.getCashBalance()));
        assertEquals(0, new BigDecimal("3").compareTo(result.getQuantity()));
        assertEquals(0, new BigDecimal("100.00").compareTo(result.getAverageCost()));

        verify(tradeRepository).save(any(Trade.class));
    }
}
