# Data dictionary: financial-banking.json

File: https://arthurgalichere.com/assets/data/economics/us/financial-banking.json (generated 2026-11-27T16:09:02+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: {filter} = hp, hamilton or cf (the filter). First and last dates marked (varies) differ across those versions.

## Series

| path | meaning | units | transformation | first | last | n |
|---|---|---|---|---|---|---|
| indicators.bank_credit_real.observations.value | Bank credit | Percent deviation from trend | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.bank_loans_real.observations.value | Loans and leases | Percent deviation from trend | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.bank_securities_real.observations.value | Real securities in bank credit | Billions of 2017 dollars (deflated by the CPI) | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.loans_ci_real.observations.value | C&I loans | Percent deviation from trend | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.loans_re_real.observations.value | Real-estate loans | Percent deviation from trend | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.loans_consumer_real.observations.value | Consumer loans | Percent deviation from trend | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.deposits_real.observations.value | Deposits | Percent deviation from trend | level as published | 1973-01-01 | 2026-07-01 | 215 |
| indicators.m2_real.observations.value | M2 | Percent deviation from trend | level as published | 1959-01-01 | 2026-07-01 | 271 |
| indicators.bank_leverage.observations.value | Bank leverage | Percentage points | level as published | 1973-01-01 | 2026-07-01 | 215 |
| indicators.prime_rate.observations.value | Bank prime loan rate | Percent | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.fedfunds.observations.value | Effective federal funds rate | Percent | level as published | 1954-07-01 | 2026-07-01 | 289 |
| indicators.prime_spread.observations.value | Prime-rate spread | Percentage points | level as published | 1954-07-01 | 2026-07-01 | 289 |
| indicators.sloos_ci_large.observations.value | Tightening of C&I standards | Percentage points | level as published | 1990-04-01 | 2026-10-01 | 147 |
| indicators.sloos_ci_small.observations.value | Net percentage of banks tightening standards for C&I loans to small firms | Net percentage of banks | level as published | 1990-04-01 | 2026-10-01 | 147 |
| indicators.sloos_cards.observations.value | Net percentage of banks tightening standards for credit card loans | Net percentage of banks | level as published | 1996-01-01 | 2026-10-01 | 124 |
| indicators.sloos_demand_ci.observations.value | Net percentage of banks reporting stronger demand for C&I loans from large and middle-market firms | Net percentage of banks | level as published | 1991-10-01 | 2026-10-01 | 141 |
| indicators.delinquency_all.observations.value | Delinquency rate | Percentage points | level as published | 1985-01-01 | 2026-04-01 | 166 |
| indicators.chargeoff_all.observations.value | Charge-off rate | Percentage points | level as published | 1985-01-01 | 2026-04-01 | 166 |
| indicators.delinquency_business.observations.value | Delinquency rate on business loans | Percent of loans | level as published | 1987-01-01 | 2026-04-01 | 158 |
| indicators.delinquency_mortgage.observations.value | Delinquency rate on single-family residential mortgages | Percent of loans | level as published | 1991-01-01 | 2026-04-01 | 142 |
| indicators.delinquency_cards.observations.value | Delinquency rate on credit card loans | Percent of loans | level as published | 1991-01-01 | 2026-04-01 | 142 |
| cycles.{filter}.y | Output (real GDP) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.bank_credit_real | Bank credit | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.bank_loans_real | Loans and leases | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.loans_ci_real | C&I loans | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.loans_re_real | Real-estate loans | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.loans_consumer_real | Consumer loans | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.deposits_real | Deposits | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1973-01-01 (varies) | 2026-07-01 | 204–215 |
| cycles.{filter}.m2_real | M2 | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1959-01-01 (varies) | 2026-07-01 | 260–271 |
| cycles.{filter}.bank_leverage | Bank leverage | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1973-01-01 (varies) | 2026-07-01 | 204–215 |
| cycles.{filter}.prime_spread | Prime-rate spread | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1954-07-01 (varies) | 2026-07-01 | 278–289 |
| cycles.{filter}.sloos_ci_large | Tightening of C&I standards | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1990-04-01 (varies) | 2026-10-01 | 136–147 |
| cycles.{filter}.delinquency_all | Delinquency rate | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1985-01-01 (varies) | 2026-04-01 | 155–166 |
| cycles.{filter}.chargeoff_all | Charge-off rate | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1985-01-01 (varies) | 2026-04-01 | 155–166 |

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: financial-banking |
| title | str: Banks and Credit Supply |
| country | values: code = US, name = United States |
| generated_at_utc | str: 2026-11-27T16:09:02+00:00 |
| recessions | recession dates (peak, trough) used to shade the charts |
| indicators.bank_credit_real.estimates | table of 1 rows; fields: series_id, date, value, method, reason |
| indicators.bank_loans_real.estimates | table of 1 rows; fields: series_id, date, value, method, reason |
| indicators.bank_securities_real.estimates | table of 1 rows; fields: series_id, date, value, method, reason |
| indicators.loans_ci_real.estimates | table of 1 rows; fields: series_id, date, value, method, reason |
| indicators.loans_re_real.estimates | table of 1 rows; fields: series_id, date, value, method, reason |
| indicators.loans_consumer_real.estimates | table of 1 rows; fields: series_id, date, value, method, reason |
| indicators.deposits_real.estimates | table of 1 rows; fields: series_id, date, value, method, reason |
| indicators.m2_real.estimates | table of 1 rows; fields: series_id, date, value, method, reason |
| indicators.bank_leverage.estimates | list:  |
| indicators.prime_rate.estimates | list:  |
| indicators.fedfunds.estimates | list:  |
| indicators.prime_spread.estimates | list:  |
| indicators.sloos_ci_large.estimates | list:  |
| indicators.sloos_ci_small.estimates | list:  |
| indicators.sloos_cards.estimates | list:  |
| indicators.sloos_demand_ci.estimates | list:  |
| indicators.delinquency_all.estimates | list:  |
| indicators.chargeoff_all.estimates | list:  |
| indicators.delinquency_business.estimates | list:  |
| indicators.delinquency_mortgage.estimates | list:  |
| indicators.delinquency_cards.estimates | list:  |
| cycles.variables.y | values: label = Output (real GDP), transform = log, units = Percent deviation from trend, source = U.S. Bureau of Economic Analysis (GDPC1) via FRED (Federal Reserve Bank of St. Louis) |
| cycles.variables.bank_credit_real | values: label = Bank credit, transform = log, units = Percent deviation from trend, source = Board of Governors of the Federal Reserve System, H.8 Assets and Liabilities of Commercial Banks (LOANINV) via FRED (Federal Reserve Bank of St. Louis); CPI (CPIAUCSL) via FRED (Federal Reserve Bank of St. L … |
| cycles.variables.bank_loans_real | values: label = Loans and leases, transform = log, units = Percent deviation from trend, source = Board of Governors of the Federal Reserve System, H.8 Assets and Liabilities of Commercial Banks (LOANS) via FRED (Federal Reserve Bank of St. Louis); CPI (CPIAUCSL) via FRED (Federal Reserve Bank of St … |
| cycles.variables.loans_ci_real | values: label = C&I loans, transform = log, units = Percent deviation from trend, source = Board of Governors of the Federal Reserve System, H.8 Assets and Liabilities of Commercial Banks (BUSLOANS) via FRED (Federal Reserve Bank of St. Louis); CPI (CPIAUCSL) via FRED (Federal Reserve Bank of St. Lo … |
| cycles.variables.loans_re_real | values: label = Real-estate loans, transform = log, units = Percent deviation from trend, source = Board of Governors of the Federal Reserve System, H.8 Assets and Liabilities of Commercial Banks (REALLN) via FRED (Federal Reserve Bank of St. Louis); CPI (CPIAUCSL) via FRED (Federal Reserve Bank of  … |
| cycles.variables.loans_consumer_real | values: label = Consumer loans, transform = log, units = Percent deviation from trend, source = Board of Governors of the Federal Reserve System, H.8 Assets and Liabilities of Commercial Banks (CONSUMER) via FRED (Federal Reserve Bank of St. Louis); CPI (CPIAUCSL) via FRED (Federal Reserve Bank of S … |
| cycles.variables.deposits_real | values: label = Deposits, transform = log, units = Percent deviation from trend, source = Board of Governors of the Federal Reserve System, H.8 Assets and Liabilities of Commercial Banks (DPSACBM027SBOG) via FRED (Federal Reserve Bank of St. Louis); CPI (CPIAUCSL) via FRED (Federal Reserve Bank of S … |
| cycles.variables.m2_real | values: label = M2, transform = log, units = Percent deviation from trend, source = Board of Governors of the Federal Reserve System, H.6 Money Stock Measures (M2SL) via FRED (Federal Reserve Bank of St. Louis); CPI (CPIAUCSL) via FRED (Federal Reserve Bank of St. Louis); author's calculation, indic … |
| cycles.variables.bank_leverage | values: label = Bank leverage, transform = level, units = Percentage points, source = Board of Governors of the Federal Reserve System, H.8 Assets and Liabilities of Commercial Banks (TLAACBM027SBOG, RALACBM027SBOG) via FRED (Federal Reserve Bank of St. Louis); author's calculation, indicator = bank … |
| cycles.variables.prime_spread | values: label = Prime-rate spread, transform = level, units = Percentage points, source = Board of Governors of the Federal Reserve System (MPRIME, FEDFUNDS) via FRED (Federal Reserve Bank of St. Louis); author's calculation, indicator = prime_spread |
| cycles.variables.sloos_ci_large | values: label = Tightening of C&I standards, transform = level, units = Percentage points, source = Board of Governors of the Federal Reserve System, Senior Loan Officer Opinion Survey on Bank Lending Practices (DRTSCILM) via FRED (Federal Reserve Bank of St. Louis), indicator = sloos_ci_large |
| cycles.variables.delinquency_all | values: label = Delinquency rate, transform = level, units = Percentage points, source = Board of Governors of the Federal Reserve System, Charge-off and Delinquency Rates (FFIEC Call Reports) (DRALACBS) via FRED (Federal Reserve Bank of St. Louis), indicator = delinquency_all |
| cycles.variables.chargeoff_all | values: label = Charge-off rate, transform = level, units = Percentage points, source = Board of Governors of the Federal Reserve System, Charge-off and Delinquency Rates (FFIEC Call Reports) (CORALACBS) via FRED (Federal Reserve Bank of St. Louis), indicator = chargeoff_all |
| cycles.methods.{filter} | values: h = 8, p = 4 |
| cycles.methods.cf_band_quarters | list: 6, 32 |
| cycles.methods.lags | list: -4, -3, -2, -1, 0, 1, 2, 3, 4 |
| tables.{filter}.stats | table of 13 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n |
| tables.{filter}.cross | table of 12 rows; fields: key, values, peak_lag, peak_value |
| downloads | values: quarterly_csv = downloads/economics/us/us-financial-banking-quarterly.csv, cycles_csv = downloads/economics/us/us-financial-banking-cycles.csv, mat = downloads/economics/us/us-financial-banking.mat |
