import type { Trade } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';

type TradeHistoryPanelProps = {
    trades: Trade[];
    isTradeHistoryLoading: boolean;
    historyError: string | null;
};

export default function TradeHistoryPanel({
    trades,
    isTradeHistoryLoading,
    historyError,
}: TradeHistoryPanelProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Trade History</CardTitle>
            </CardHeader>
            <CardContent>
                {isTradeHistoryLoading && <p>Loading trade history...</p>}
                {historyError !== null && (
                    <p role='alert' className='text-destructive'>
                        {historyError}
                    </p>
                )}
                {!isTradeHistoryLoading &&
                    historyError === null &&
                    trades.length === 0 && <p>No trades yet.</p>}
                {!isTradeHistoryLoading &&
                    historyError === null &&
                    trades.length > 0 && (
                        <div className='max-h-80 overflow-y-auto'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Symbol</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Shares</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Order Cost</TableHead>
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
                                            <TableCell>
                                                {trade.symbol}
                                            </TableCell>
                                            <TableCell>{trade.type}</TableCell>
                                            <TableCell>
                                                {trade.quantity}
                                            </TableCell>
                                            <TableCell>
                                                $
                                                {trade.executionPrice.toFixed(
                                                    2,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                $
                                                {(
                                                    trade.quantity *
                                                    trade.executionPrice
                                                ).toFixed(2)}
                                            </TableCell>
                                            <TableCell
                                                className={
                                                    trade.realizedPL === null ||
                                                    trade.realizedPL === 0
                                                        ? ''
                                                        : trade.realizedPL > 0
                                                          ? 'text-green-500'
                                                          : 'text-destructive'
                                                }
                                            >
                                                {trade.realizedPL === null
                                                    ? '—'
                                                    : `$${trade.realizedPL.toFixed(2)}`}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
            </CardContent>
        </Card>
    );
}
