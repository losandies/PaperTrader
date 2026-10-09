import type { Portfolio } from '@/types';
import { Button } from './ui/button';
import HoldingsTable from './HoldingsTable';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type PortfolioPanelProps = {
    portfolio: Portfolio;
    loadPortfolio: () => void;
    onSelectHolding: (symbol: string) => void;
};

export default function PortfolioPanel({
    portfolio,
    loadPortfolio,
    onSelectHolding,
}: PortfolioPanelProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
                <div className='space-y-2'>
                    <Button
                        className='w-full'
                        variant={'outline'}
                        onClick={loadPortfolio}
                    >
                        Refresh portfolio
                    </Button>
                    <p>Cash balance: ${portfolio.cashBalance.toFixed(2)}</p>

                    <HoldingsTable
                        holdings={portfolio.holdings}
                        onSelectHolding={onSelectHolding}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
