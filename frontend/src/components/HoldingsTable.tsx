import type { Holding } from '../types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from './ui/table';

type HoldingsTableProps = {
    holdings: Holding[];
};

export default function HoldingsTable({ holdings }: HoldingsTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Avg. Cost</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {holdings.map((holding) => (
                    <TableRow key={holding.symbol}>
                        <TableCell>{holding.symbol}</TableCell>
                        <TableCell>{holding.quantity}</TableCell>
                        <TableCell>${holding.averageCost.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
