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

export interface Transaction {
    id: string;
    type: TransactionNamespace.Type;
    payload: DepositPayload | WithdrawPayload | TransferPayload;
}

export interface Deposit extends Transaction {
    type: TransactionNamespace.Type.deposit;
    payload: DepositPayload;
}

interface DepositPayload {
    balanceId: string;
    amount: Decimal;
}

export interface Withdraw extends Transaction {
    type: TransactionNamespace.Type.withdraw;
    payload: WithdrawPayload;
}

interface WithdrawPayload {
    balanceId: string;
    amount: Decimal;
}

export interface Transfer extends Transaction {
    type: TransactionNamespace.Type.transfer;
    payload: TransferPayload;
}

interface TransferPayload {
    fromBalanceId: string;
    toBalanceId: string;
    amount: Decimal;
}

export interface ITransactionProcessor {
    process(balances: Record<string, Balance | undefined>, transactions: Array<Transaction>): void;
}

export function isDeposit(transaction: Transaction): transaction is Deposit {
    return transaction.type === TransactionNamespace.Type.deposit;
}

export function isWithdraw(transaction: Transaction): transaction is Withdraw {
    return transaction.type === TransactionNamespace.Type.withdraw;
}

export function isTransfer(transaction: Transaction): transaction is Transfer {
    return transaction.type === TransactionNamespace.Type.transfer;
}
