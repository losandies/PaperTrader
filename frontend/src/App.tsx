import { useEffect, useState } from 'react';
import type { Portfolio, Trade, TradeSelection } from './types';
import StockSearch from './components/StockSearch';
import TickerStrip from './components/TickerStrip';
import PortfolioPanel from './components/PortfolioPanel';
import HoldingDetailsPanel from './components/HoldingDetailsPanel';
import TradePanel from './components/TradePanel';
import TradeHistoryPanel from './components/TradeHistoryPanel';

function App() {
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
    const [tradeSelection, setTradeSelection] = useState<TradeSelection | null>(
        null,
    );
    const [trades, setTrades] = useState<Trade[]>([]);
    const [isTradeHistoryLoading, setIsTradeHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState<string | null>(null);

    const loadPortfolio = (): void => {
        fetch('http://localhost:8080/accounts/1/portfolio')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Unable to load portfolio');
                }

                return response.json();
            })
            .then((data: Portfolio) => {
                setPortfolio(data);
                setError(null);
            })
            .catch(() => setError('Unable to load portfolio'));
    };

    const loadTradeHistory = (): void => {
        fetch('http://localhost:8080/accounts/1/trades')
            .then((response) => {
                if (!response.ok) {
                    return response.text().then((message) => {
                        throw new Error(
                            message || 'Could not get trade history',
                        );
                    });
                }
                return response.json();
            })
            .then((data) => setTrades(data))
            .catch((error: unknown) => {
                setHistoryError(
                    error instanceof Error
                        ? error.message
                        : 'Could not get trade history',
                );
            })
            .finally(() => setIsTradeHistoryLoading(false));
    };

    const handleTradeSuccess = (): void => {
        setIsTradeHistoryLoading(true);
        setHistoryError(null);
        loadPortfolio();
        loadTradeHistory();
    };

    useEffect(() => {
        loadPortfolio();
        loadTradeHistory();
    }, []);

    if (error != null) {
        return <p>{error}</p>;
    }

    if (portfolio == null) {
        return <p>Loading Portfolio...</p>;
    }

    const selectedHolding = portfolio.holdings.find(
        (holding) => holding.symbol === selectedSymbol,
    );

    return (
        <>
            <TickerStrip />
            <div className='px-10'>
                <h1 className='text-3xl font-semibold my-6'>Paper Trading</h1>
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    <div className='space-y-6'>
                        <PortfolioPanel
                            portfolio={portfolio}
                            loadPortfolio={loadPortfolio}
                            onSelectHolding={setSelectedSymbol}
                        />
                        <TradeHistoryPanel
                            trades={trades}
                            isTradeHistoryLoading={isTradeHistoryLoading}
                            historyError={historyError}
                        />
                        {tradeSelection && (
                            <TradePanel
                                key={`${tradeSelection.symbol}-${tradeSelection.mode}`}
                                selection={tradeSelection}
                                onClose={() => setTradeSelection(null)}
                                onTradeSuccess={handleTradeSuccess}
                            />
                        )}
                    </div>
                    <div className='space-y-6'>
                        <StockSearch onTradeSuccess={handleTradeSuccess} />
                        {selectedHolding && (
                            <HoldingDetailsPanel
                                holding={selectedHolding}
                                key={selectedHolding.symbol}
                                onOpenTrade={setTradeSelection}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
