import type { Holding } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type HoldingDetailsPanelProps = {
    holding: Holding;
};

export default function HoldingDetailsPanel({
    holding,
}: HoldingDetailsPanelProps) {
    const costBasis = holding.quantity * holding.averageCost;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{holding.symbol} Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
                <p>Shares: {holding.quantity}</p>
                <p>Average cost: ${holding.averageCost.toFixed(2)}</p>
                <p>Cost basis: ${costBasis.toFixed(2)}</p>
            </CardContent>
        </Card>
    );
}
