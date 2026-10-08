package dev.brandon.papertradingapi.service;

import dev.brandon.papertradingapi.model.Account;
import dev.brandon.papertradingapi.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class AccountService {
    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account createAccount(String username) {
        Account account = new Account(username, new BigDecimal("100000.00"));
        return accountRepository.save(account);
    }

    public Optional<Account> getAccount(Long id) {
        return accountRepository.findById(id);
    }


    private final AccountRepository accountRepository;
}