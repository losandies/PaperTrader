import { useEffect, useState } from 'react';
import type { Portfolio } from './types';
import TradePanel from './components/TradePanel';
import StockSearch from './components/StockSearch';
import TickerStrip from './components/TickerStrip';
import PortfolioPanel from './components/PortfolioPanel';
import HoldingDetailsPanel from './components/HoldingDetailsPanel';

function App() {
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);

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

    useEffect(() => loadPortfolio(), []);

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
                        <TradePanel onTradeSuccess={loadPortfolio} />
                    </div>
                    <div className='space-y-6'>
                        <StockSearch />
                        {selectedHolding && (
                            <HoldingDetailsPanel holding={selectedHolding} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
