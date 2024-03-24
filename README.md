# Accounting

## Test results

Node.js

```bash
➜  node git:(master) ✗ ts-node benchmark.ts
TransactionProcessorImpl#process: 985 ns/op
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

Rust

```bash
➜  rust git:(master) ✗ cargo bench
     Running benches/performance.rs (target/release/deps/performance-4c2f7c2848c97d61)
TransactionProcessor::process
                        time:   [1.4015 µs 1.4095 µs 1.4180 µs]
                        change: [-1.4272% -0.6509% +0.0777%] (p = 0.08 > 0.05)
```
