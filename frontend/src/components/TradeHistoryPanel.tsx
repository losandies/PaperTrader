import type { Trade } from '@/types';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';

export default function TradeHistoryPanel() {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Could not get trade history',
                );
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
                {!isLoading && error === null && trades.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Shares</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>P/L</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trades.map((trade) => (
                                <TableRow key={trade.id}>
                                    <TableCell>
                                        {new Date(
                                            trade.executedAt,
                                        ).toLocaleString()}
                                    </TableCell>
                                    <TableCell>{trade.symbol}</TableCell>
                                    <TableCell>{trade.type}</TableCell>
                                    <TableCell>{trade.quantity}</TableCell>
                                    <TableCell>
                                        ${trade.executionPrice.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {trade.realizedPL === null
                                            ? '—'
                                            : `$${trade.realizedPL.toFixed(2)}`}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
