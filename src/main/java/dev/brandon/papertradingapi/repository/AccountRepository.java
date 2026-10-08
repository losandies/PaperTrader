package dev.brandon.papertradingapi.repository;

import dev.brandon.papertradingapi.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}