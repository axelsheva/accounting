import Benchmark from 'benchmark';
import { Decimal } from 'decimal.js-light';
import { TransactionProcessor } from './transactionProcessor';
import { Balance, Transaction, TransactionNamespace } from './types';

const balances: Record<string, Balance> = {};
const transactions: Array<Transaction> = [];

const transferToBalanceId = 'balance-transfer';
balances[transferToBalanceId] = { id: transferToBalanceId, amount: new Decimal(0) };

for (let i = 0; i < 2; i++) {
    const balanceId = `balance-${i}`;
    balances[balanceId] = { id: balanceId, amount: new Decimal(1000) };

    transactions.push({
        id: `deposit-${i}`,
        type: TransactionNamespace.Type.deposit,
        payload: { balanceId, amount: new Decimal(100) },
    });

    transactions.push({
        id: `withdraw-${i}`,
        type: TransactionNamespace.Type.withdraw,
        payload: { balanceId, amount: new Decimal(50) },
    });

    transactions.push({
        id: `transfer-${i}`,
        type: TransactionNamespace.Type.transfer,
        payload: {
            fromBalanceId: balanceId,
            toBalanceId: transferToBalanceId,
            amount: new Decimal(25),
        },
    });
}

const transactionProcessor = new TransactionProcessor();

const suite = new Benchmark.Suite();

suite
    .add('TransactionProcessorImpl#process', function () {
        transactionProcessor.process(balances, transactions);
    })
    .on('cycle', (event: any) => {
        const benchmark = event.target;
        const msPerOp = benchmark.times.period * 1000; // time in milliseconds per operation
        const nsPerOp = msPerOp * 1000000; // conversion in nanoseconds per operation
        console.log(`${benchmark.name}: ${nsPerOp.toFixed(0)} ns/op`);
    })
    .run({ async: true });
