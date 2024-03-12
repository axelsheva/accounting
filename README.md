# Accounting

## Test results

Node.js

```bash
➜  node git:(master) ✗ ts-node benchmark.ts
TransactionProcessorImpl#process x 390,620 ops/sec ±1.58% (90 runs sampled)
Fastest is TransactionProcessorImpl#process
```

Go

```bash
➜  go git:(master) ✗ go test -bench=.
goos: darwin
goarch: arm64
pkg: accounting-go
BenchmarkProcessTransactions-10          1969898               602.9 ns/op
PASS
ok      accounting-go   2.215s
```
