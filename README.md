# Paper Trading App

A full-stack stock trading simulator built with Spring Boot, PostgreSQL, React, and TypeScript. Search for stocks, place simulated trades, and track portfolio performance without using real money.

## Demo

Video walkthrough coming soon.

The demo will cover stock lookup, purchase confirmation, holding performance, selling shares, and transaction history.

## Features

- **Stock lookup:** quotes and a scrolling price ticker powered by Twelve Data.
- **Simulated trading:** $100,000 starting cash, buy/sell previews, partial sales, and Sell All.
- **Portfolio tracking:** cash balances, holdings, and weighted average purchase costs.
- **Holding performance:** market value, unrealized profit/loss, and return percentage.
- **Transaction history:** execution prices, timestamps, transaction totals, and realized profit/loss for sales.
- **Responsive dashboard:** connected portfolio, holding details, and trade cards, with automatic data refresh after trades and readable API quota errors.

## Tech stack

| Layer       | Technologies                                   |
| ----------- | ---------------------------------------------- |
| Backend     | Java, Spring Boot, Spring MVC, Spring Data JPA |
| Database    | PostgreSQL                                     |
| Frontend    | React, TypeScript, Vite                        |
| UI          | Tailwind CSS, shadcn/ui                        |
| Market data | Twelve Data REST API                           |
| Testing     | JUnit, Mockito                                 |

## Architecture

The React frontend communicates with a Spring Boot REST API. Controllers expose account, portfolio, stock, and trading endpoints; services handle trading rules and market-data requests; Spring Data repositories persist accounts, holdings, and trades in PostgreSQL. The market-data API key stays on the backend.

Buy and sell operations use database transactions to group balance changes, holding updates, and trade-history records. Financial calculations use `BigDecimal`. Additional purchases update weighted average cost, and sales calculate realized P/L against the holding's average cost.

Preview totals are estimates. The backend fetches a fresh price when confirming an order. Trade timestamps are stored as `Instant` values and displayed in the browser's local timezone.

Shared React hooks manage purchase and sale requests, previews, loading states, and errors. The dashboard refreshes portfolio and history data after successful trades.

## Testing

An initial Mockito-based service test verifies that a purchase deducts the expected cash, creates the correct holding, and saves a trade record without calling the database or market-data API. Broader coverage is planned.

## Current scope

This is a single-account portfolio project intended for local demonstration. Authentication and account access controls are not implemented. Market-data access depends on Twelve Data availability and API limits; there is no offline mode or price cache yet.

Orders are simulated immediate executions, without limit orders, fees, or slippage. The quantity controls primarily support whole shares; fractional-share workflows are not supported throughout the UI.

## Next steps

Authentication, market-data caching, and broader trading-rule tests.
