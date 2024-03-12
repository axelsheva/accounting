package main

import (
	"errors"
	"fmt"

	"github.com/shopspring/decimal"
)

type TransactionType string

const (
	Deposit  TransactionType = "deposit"
	Withdraw TransactionType = "withdraw"
	Transfer TransactionType = "transfer"
)

type Balance struct {
	ID     string
	Amount decimal.Decimal
}

type Transaction struct {
	ID      string
	Type    TransactionType
	Payload interface{}
}

type DepositPayload struct {
	BalanceID string
	Amount    decimal.Decimal
}

type WithdrawPayload struct {
	BalanceID string
	Amount    decimal.Decimal
}

type TransferPayload struct {
	FromBalanceID string
	ToBalanceID   string
	Amount        decimal.Decimal
}

type TransactionProcessor struct {
	MinimumAllowedBalance decimal.Decimal
}

func NewTransactionProcessor() *TransactionProcessor {
	return &TransactionProcessor{
		MinimumAllowedBalance: decimal.NewFromInt(0),
	}
}

func (tp *TransactionProcessor) Process(balances map[string]*Balance, transactions []Transaction) error {
	for _, transaction := range transactions {
		switch transaction.Type {
		case Deposit:
			tp.processDeposit(transaction, balances)
		case Withdraw:
			tp.processWithdraw(transaction, balances)
		case Transfer:
			tp.processTransfer(transaction, balances)
		default:
			return errors.New("unsupported transaction type")
		}
	}

	return tp.finalBalanceCheck(balances)
}

func (tp *TransactionProcessor) processDeposit(transaction Transaction, balances map[string]*Balance) error {
	payload := transaction.Payload.(DepositPayload)
	balance, ok := balances[payload.BalanceID]
	if !ok {
		return fmt.Errorf("Balance %s is missing", payload.BalanceID)
	}

	balance.Amount = balance.Amount.Add(payload.Amount)

	return nil
}

func (tp *TransactionProcessor) processWithdraw(transaction Transaction, balances map[string]*Balance) error {
	payload := transaction.Payload.(WithdrawPayload)
	balance, ok := balances[payload.BalanceID]
	if !ok {
		return fmt.Errorf("Balance %s is missing", payload.BalanceID)
	}

	balance.Amount = balance.Amount.Sub(payload.Amount)

	return nil
}

func (tp *TransactionProcessor) processTransfer(transaction Transaction, balances map[string]*Balance) error {
	payload := transaction.Payload.(TransferPayload)
	fromBalance, ok := balances[payload.FromBalanceID]
	if !ok {
		return fmt.Errorf("from balance %s is missing", payload.FromBalanceID)
	}

	toBalance, ok := balances[payload.ToBalanceID]
	if !ok {
		return fmt.Errorf("to balance %s is missing", payload.ToBalanceID)
	}

	fromBalance.Amount = fromBalance.Amount.Sub(payload.Amount)
	toBalance.Amount = toBalance.Amount.Add(payload.Amount)

	return nil
}

func (tp *TransactionProcessor) finalBalanceCheck(balances map[string]*Balance) error {
	for id, balance := range balances {
		if balance.Amount.LessThan(tp.MinimumAllowedBalance) {
			return fmt.Errorf("final balance check failed for %s: balance is below minimum allowed", id)
		}
	}
	return nil
}
