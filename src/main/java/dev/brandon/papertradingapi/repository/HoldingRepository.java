package dev.brandon.papertradingapi.repository;

import dev.brandon.papertradingapi.model.Account;
import dev.brandon.papertradingapi.model.Holding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HoldingRepository extends JpaRepository<Holding, Long> {
    Optional<Holding> findByAccountAndSymbol(Account account, String symbol);

    List<Holding> findAllByAccount(Account account);
}