package dev.brandon.papertradingapi.controller;

import dev.brandon.papertradingapi.model.Account;
import dev.brandon.papertradingapi.repository.AccountRepository;
import dev.brandon.papertradingapi.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
public class AccountController {

    private final AccountRepository accountRepository;

    @PostMapping("/accounts")
    public Account createAccount(@RequestParam String username) {
        return accountService.createAccount(username);
    }

    @GetMapping("/accounts/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable Long id) {

        Optional<Account> account = accountService.getAccount(id);

        return account.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());

    }

    private final AccountService accountService;

    public AccountController(AccountService accountService, AccountRepository accountRepository) {
        this.accountService = accountService;
        this.accountRepository = accountRepository;
    }


}