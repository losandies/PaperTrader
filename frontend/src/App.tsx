import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import type { Holding } from './types';
import HoldingsTable from './components/HoldingsTable';
import TradePanel from './components/TradePanel';
import StockSearch from './components/StockSearch';
import TickerStrip from './components/TickerStrip';

type Portfolio = {
    cashBalance: number;
    holdings: Holding[];
};

function App() {
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [error, setError] = useState<string | null>(null);

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
    return (
        <main className='mx-auto max-w-6xl space-y-6 p-6 w-[80%]'>
            <TickerStrip />
            <h1 className='text-3xl font-semibold'>Paper Trading</h1>
            {portfolio && (
                <div className='space-y-2'>
                    <Button
                        className='w-full'
                        variant={'outline'}
                        onClick={loadPortfolio}
                    >
                        Refresh portfolio
                    </Button>
                    <p>Cash balance: ${portfolio.cashBalance.toFixed(2)}</p>

                    <HoldingsTable holdings={portfolio.holdings} />
                </div>
            )}
            <StockSearch />
            <TradePanel onTradeSuccess={loadPortfolio} />
        </main>
    );
}

export default App;
