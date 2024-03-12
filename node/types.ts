import { Decimal } from 'decimal.js-light';

export type Balance = {
    id: string;
    amount: Decimal;
};

export namespace TransactionNamespace {
    export enum Type {
        deposit = 'deposit',
        withdraw = 'withdraw',
        transfer = 'transfer',
    }
}

interface ITransactionBase {
    id: string;
    type: TransactionNamespace.Type;
}

interface DepositPayload {
    balanceId: string;
    amount: Decimal;
}

export interface Deposit extends ITransactionBase {
    type: TransactionNamespace.Type.deposit;
    payload: DepositPayload;
}

interface WithdrawPayload {
    balanceId: string;
    amount: Decimal;
}

export interface Withdraw extends ITransactionBase {
    type: TransactionNamespace.Type.withdraw;
    payload: WithdrawPayload;
}

interface TransferPayload {
    fromBalanceId: string;
    toBalanceId: string;
    amount: Decimal;
}

export interface Transfer extends ITransactionBase {
    type: TransactionNamespace.Type.transfer;
    payload: TransferPayload;
}

export type Transaction = Deposit | Withdraw | Transfer;

export interface ITransactionProcessor {
    process(balances: Record<string, Balance | undefined>, transactions: Array<Transaction>): void;
}
