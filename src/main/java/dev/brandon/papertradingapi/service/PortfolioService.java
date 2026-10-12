package dev.brandon.papertradingapi.service;

import dev.brandon.papertradingapi.model.Account;
import dev.brandon.papertradingapi.model.Holding;
import dev.brandon.papertradingapi.model.HoldingResponse;
import dev.brandon.papertradingapi.model.Portfolio;
import dev.brandon.papertradingapi.repository.AccountRepository;
import dev.brandon.papertradingapi.repository.HoldingRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PortfolioService {
    private AccountRepository accountRepository;
    private HoldingRepository holdingRepository;

    public Portfolio getPortfolio(Long accountId) {
        Account account = accountRepository.findById(accountId).orElseThrow();
        List<Holding> holdings = holdingRepository.findAllByAccount(account);
        List<HoldingResponse> holdingResponses = new ArrayList<>();

        for (Holding holding : holdings) {
            HoldingResponse response = new HoldingResponse(
                    holding.getSymbol(),
                    holding.getQuantity(),
                    holding.getAverageCost()
            );

            holdingResponses.add(response);
        }
        BigDecimal cashBalance = account.getCashBalance();

        return new Portfolio(cashBalance, holdingResponses);

    }

    public PortfolioService(AccountRepository accountRepository, HoldingRepository holdingRepository) {
        this.accountRepository = accountRepository;
        this.holdingRepository = holdingRepository;
    }
}