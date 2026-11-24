# Data dictionary: financial-conditions.json

File: https://arthurgalichere.com/assets/data/economics/us/financial-conditions.json (generated 2026-11-24T22:39:54+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: {filter} = hp, hamilton or cf (the filter). First and last dates marked (varies) differ across those versions.

## Series

| path | meaning | units | transformation | first | last | n |
|---|---|---|---|---|---|---|
| indicators.nfci.observations.value | NFCI | Percentage points | level as published | 1971-04-01 | 2026-07-01 | 222 |
| indicators.anfci.observations.value | Adjusted NFCI | Percentage points | level as published | 1971-04-01 | 2026-07-01 | 222 |
| indicators.nfci_risk.observations.value | NFCI risk subindex | Index (0 = average financial conditions; positive = tighter than average) | level as published | 1971-04-01 | 2026-07-01 | 222 |
| indicators.nfci_credit.observations.value | NFCI credit subindex | Index (0 = average financial conditions; positive = tighter than average) | level as published | 1971-04-01 | 2026-07-01 | 222 |
| indicators.nfci_leverage.observations.value | NFCI leverage subindex | Index (0 = average financial conditions; positive = tighter than average) | level as published | 1971-04-01 | 2026-07-01 | 222 |
| indicators.nfci_nonfin_leverage.observations.value | NFCI nonfinancial leverage subindex | Index (0 = average financial conditions; positive = tighter than average) | level as published | 1971-04-01 | 2026-07-01 | 222 |
| indicators.stlfsi.observations.value | St. Louis Fed stress index | Percentage points | level as published | 1994-01-01 | 2026-07-01 | 131 |
| indicators.kcfsi.observations.value | Kansas City Fed stress index | Percentage points | level as published | 1990-04-01 | 2026-07-01 | 146 |
| indicators.vix.observations.value | VIX | Percentage points | level as published | 1990-01-01 | 2026-07-01 | 147 |
| indicators.baa_aaa.observations.value | Baa minus Aaa | Percentage points | level as published | 1950-01-01 | 2026-07-01 | 307 |
| indicators.baa_10y.observations.value | Baa minus 10-year Treasury | Percentage points | level as published | 1953-04-01 | 2026-07-01 | 294 |
| indicators.term_spread.observations.value | Term spread | Percentage points | level as published | 1953-04-01 | 2026-07-01 | 294 |
| indicators.gz_spread.observations.value | GZ credit spread | Percentage points | level as published | 1973-01-01 | 2026-07-01 | 215 |
| indicators.ebp.observations.value | Excess bond premium | Percentage points | level as published | 1973-01-01 | 2026-07-01 | 215 |
| cycles.{filter}.y | Output (real GDP) | Percent deviation from trend | cycle of 100 × log (percent deviation from trend); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.nfci | NFCI | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1971-04-01 (varies) | 2026-07-01 | 211–222 |
| cycles.{filter}.anfci | Adjusted NFCI | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1971-04-01 (varies) | 2026-07-01 | 211–222 |
| cycles.{filter}.stlfsi | St. Louis Fed stress index | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1994-01-01 (varies) | 2026-07-01 | 120–131 |
| cycles.{filter}.kcfsi | Kansas City Fed stress index | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1990-04-01 (varies) | 2026-07-01 | 135–146 |
| cycles.{filter}.vix | VIX | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1990-01-01 (varies) | 2026-07-01 | 136–147 |
| cycles.{filter}.baa_aaa | Baa minus Aaa | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1950-01-01 | 2026-07-01 | 307 |
| cycles.{filter}.baa_10y | Baa minus 10-year Treasury | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1953-04-01 (varies) | 2026-07-01 | 283–294 |
| cycles.{filter}.gz_spread | GZ credit spread | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1973-01-01 (varies) | 2026-07-01 | 204–215 |
| cycles.{filter}.ebp | Excess bond premium | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1973-01-01 (varies) | 2026-07-01 | 204–215 |
| cycles.{filter}.term_spread | Term spread | Percentage points | cycle of the level (deviation from trend, in the units shown); cycle by {filter} | 1953-04-01 (varies) | 2026-07-01 | 283–294 |

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: financial-financial-conditions |
| title | str: Financial Conditions and Stress |
| country | values: code = US, name = United States |
| generated_at_utc | str: 2026-11-24T22:39:54+00:00 |
| recessions | recession dates (peak, trough) used to shade the charts |
| indicators.nfci.estimates | list:  |
| indicators.anfci.estimates | list:  |
| indicators.nfci_risk.estimates | list:  |
| indicators.nfci_credit.estimates | list:  |
| indicators.nfci_leverage.estimates | list:  |
| indicators.nfci_nonfin_leverage.estimates | list:  |
| indicators.stlfsi.estimates | list:  |
| indicators.kcfsi.estimates | list:  |
| indicators.vix.estimates | list:  |
| indicators.baa_aaa.estimates | list:  |
| indicators.baa_10y.estimates | list:  |
| indicators.term_spread.estimates | list:  |
| indicators.gz_spread.estimates | list:  |
| indicators.ebp.estimates | list:  |
| cycles.keys | list: nfci, anfci, stlfsi, kcfsi, vix, baa_aaa, baa_10y, gz_spread, ebp, term_spread |
| cycles.variables.y | values: label = Output (real GDP), transform = log, units = Percent deviation from trend, source = U.S. Bureau of Economic Analysis (GDPC1) via FRED (Federal Reserve Bank of St. Louis) |
| cycles.variables.nfci | values: label = NFCI, transform = level, units = Percentage points, source = Federal Reserve Bank of Chicago (NFCI) via FRED (Federal Reserve Bank of St. Louis), indicator = nfci |
| cycles.variables.anfci | values: label = Adjusted NFCI, transform = level, units = Percentage points, source = Federal Reserve Bank of Chicago (ANFCI) via FRED (Federal Reserve Bank of St. Louis), indicator = anfci |
| cycles.variables.stlfsi | values: label = St. Louis Fed stress index, transform = level, units = Percentage points, source = Federal Reserve Bank of St. Louis (STLFSI4) via FRED (Federal Reserve Bank of St. Louis), indicator = stlfsi |
| cycles.variables.kcfsi | values: label = Kansas City Fed stress index, transform = level, units = Percentage points, source = Federal Reserve Bank of Kansas City (KCFSI) via FRED (Federal Reserve Bank of St. Louis), indicator = kcfsi |
| cycles.variables.vix | values: label = VIX, transform = level, units = Percentage points, source = Chicago Board Options Exchange (VIXCLS) via FRED (Federal Reserve Bank of St. Louis), indicator = vix |
| cycles.variables.baa_aaa | values: label = Baa minus Aaa, transform = level, units = Percentage points, source = Moody's (BAA, AAA) via FRED (Federal Reserve Bank of St. Louis); author's calculation, indicator = baa_aaa |
| cycles.variables.baa_10y | values: label = Baa minus 10-year Treasury, transform = level, units = Percentage points, source = Moody's (BAA) and Board of Governors of the Federal Reserve System (GS10) via FRED (Federal Reserve Bank of St. Louis); author's calculation, indicator = baa_10y |
| cycles.variables.gz_spread | values: label = GZ credit spread, transform = level, units = Percentage points, source = Gilchrist and Zakrajšek (2012), updated by the Board of Governors of the Federal Reserve System, indicator = gz_spread |
| cycles.variables.ebp | values: label = Excess bond premium, transform = level, units = Percentage points, source = Gilchrist and Zakrajšek (2012), updated by the Board of Governors of the Federal Reserve System, indicator = ebp |
| cycles.variables.term_spread | values: label = Term spread, transform = level, units = Percentage points, source = Board of Governors of the Federal Reserve System (GS10, TB3MS) via FRED (Federal Reserve Bank of St. Louis); author's calculation, indicator = term_spread |
| cycles.methods.{filter} | values: h = 8, p = 4 |
| cycles.methods.cf_band_quarters | list: 6, 32 |
| cycles.methods.lags | list: -4, -3, -2, -1, 0, 1, 2, 3, 4 |
| tables.{filter}.stats | table of 11 rows; fields: key, sd, rel_sd, ar1, corr_y, start, end, n |
| tables.{filter}.cross | table of 10 rows; fields: key, values, peak_lag, peak_value |
| downloads | values: quarterly_csv = downloads/economics/us/us-financial-conditions-quarterly.csv, cycles_csv = downloads/economics/us/us-financial-conditions-cycles.csv, mat = downloads/economics/us/us-financial-conditions.mat |
