import Decimal from 'decimal.js-light';
import {
    Balance,
    Deposit,
    ITransactionProcessor,
    Transaction,
    TransactionNamespace,
    Transfer,
    Withdraw,
} from './types';

export class TransactionProcessor implements ITransactionProcessor {
    private readonly minimumAllowedBalance: Decimal;

    constructor() {
        this.minimumAllowedBalance = new Decimal(0);
    }

    process(balances: Record<string, Balance | undefined>, transactions: Array<Transaction>): void {
        transactions.forEach((transaction) => {
            switch (transaction.type) {
                case TransactionNamespace.Type.deposit:
                    this.processDeposit(transaction, balances);
                    break;
                case TransactionNamespace.Type.withdraw:
                    this.processWithdraw(transaction, balances);
                    break;
                case TransactionNamespace.Type.transfer:
                    this.processTransfer(transaction, balances);
                    break;
                default:
                    throw new Error('Invalid transaction type');
            }
        });

        this.finalBalanceCheck(balances);
    }

    private processDeposit(
        transaction: Deposit,
        balances: Record<string, Balance | undefined>,
    ): void {
        const balance = balances[transaction.payload.balanceId];
        if (!balance) {
            throw new Error(`Balance ${transaction.payload.balanceId} is missing`);
        }

        balance.amount = balance.amount.plus(transaction.payload.amount);
    }

    private processWithdraw(
        transaction: Withdraw,
        balances: Record<string, Balance | undefined>,
    ): void {
        const balance = balances[transaction.payload.balanceId];
        if (!balance) {
            throw new Error(`Balance ${transaction.payload.balanceId} is missing`);
        }

        balance.amount = balance.amount.minus(transaction.payload.amount);
    }

    private processTransfer(
        transaction: Transfer,
        balances: Record<string, Balance | undefined>,
    ): void {
        const fromBalance = balances[transaction.payload.fromBalanceId];
        const toBalance = balances[transaction.payload.toBalanceId];

        if (!fromBalance) {
            throw new Error(`From balance ${transaction.payload.fromBalanceId} is missing`);
        }
        if (!toBalance) {
            throw new Error(`To balance ${transaction.payload.toBalanceId} is missing`);
        }

        fromBalance.amount = fromBalance.amount.minus(transaction.payload.amount);
        toBalance.amount = toBalance.amount.plus(transaction.payload.amount);
    }

    private finalBalanceCheck(balances: Record<string, Balance | undefined>): void {
        Object.entries(balances).forEach(([balanceId, balance]) => {
            if (balance && balance.amount.lessThan(this.minimumAllowedBalance)) {
                throw new Error(
                    `Final balance check failed for ${balanceId}: balance is below minimum allowed. Balance is ${balance.amount}.`,
                );
            }
        });
    }
}
