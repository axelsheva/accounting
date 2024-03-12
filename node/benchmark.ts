import Benchmark from 'benchmark';
import { Decimal } from 'decimal.js-light';
import { TransactionProcessor } from './transactionProcessor';
import { Balance, Transaction, TransactionNamespace } from './types';

const balances: Record<string, Balance> = {};
const transactions: Array<Transaction> = [];

for (let i = 0; i < 6; i++) {
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

    if (i > 0) {
        transactions.push({
            id: `transfer-${i}`,
            type: TransactionNamespace.Type.transfer,
            payload: {
                fromBalanceId: `balance-${i - 1}`,
                toBalanceId: balanceId,
                amount: new Decimal(25),
            },
        });
    }
}

const transactionProcessor = new TransactionProcessor();

const suite = new Benchmark.Suite();

suite
    .add('TransactionProcessorImpl#process', function () {
        transactionProcessor.process(balances, transactions);
    })
    .on('cycle', (event: any) => {
        console.log(String(event.target));
    })
    .on('complete', () => {
        console.log('Fastest is ' + suite.filter('fastest').map('name'));
    })
    .run({ async: true });
