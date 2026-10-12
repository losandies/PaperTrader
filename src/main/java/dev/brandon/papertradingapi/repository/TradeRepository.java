package dev.brandon.papertradingapi.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import dev.brandon.papertradingapi.model.Account;
import dev.brandon.papertradingapi.model.Trade;

public interface TradeRepository extends JpaRepository<Trade, Long>{
    List<Trade> findByAccountOrderByExecutedAtDesc(Account account);
}
