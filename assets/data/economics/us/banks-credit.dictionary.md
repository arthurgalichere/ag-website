# Data dictionary: banks-credit.json

File: https://arthurgalichere.com/assets/data/economics/us/banks-credit.json (generated 2026-11-27T16:11:21+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: . First and last dates marked (varies) differ across those versions.

## Series

| path | meaning | units | transformation | first | last | n |
|---|---|---|---|---|---|---|
| quarterly.values.prime | Bank prime loan rate | Percent a year | quarterly average of monthly data | 1959-01-01 | 2026-07-01 | 271 |
| quarterly.values.m2_own | M2 own rate | Percent a year | quarterly average of monthly data | 1959-04-01 | 2019-04-01 | 241 |
| quarterly.values.dep_cost_qbp | Effective deposit cost (FDIC, all insured institutions) | Percent a year | 400 × interest expense on deposits of the quarter / average deposits (end of quarter and previous quarter) | 1984-04-01 | 2026-07-01 | 170 |
| quarterly.values.rd_nominal | Deposit rate (M2 own rate to 2019Q2, then FDIC deposit cost) | Percent a year | M2 own rate to 2019 Q2, then dep_cost_qbp | 1959-04-01 | 2026-07-01 | 270 |
| quarterly.values.infl_cpi | CPI-U inflation, year on year | Percent a year | quarterly average of 100 × (CPI_m / CPI_m−12 − 1) | 1959-01-01 | 2026-07-01 | 271 |
| quarterly.values.g_real | Real GDP growth, year on year | Percent a year | 100 × (GDPC1_t / GDPC1_t−4 − 1) | 1959-01-01 | 2026-07-01 | 271 |
| quarterly.values.rd_minus_g | Real deposit rate minus real GDP growth | Percent a year | rd_nominal − infl_cpi − g_real | 1959-04-01 | 2026-07-01 | 270 |
| quarterly.values.rd_m2own_minus_g | Real deposit rate minus growth, M2 own rate (to 2019Q2) | Percent a year | m2_own − infl_cpi − g_real | 1959-04-01 | 2019-04-01 | 241 |
| quarterly.values.rd_fdic_minus_g | Real deposit rate minus growth, FDIC deposit cost | Percent a year | dep_cost_qbp − infl_cpi − g_real | 1984-04-01 | 2026-07-01 | 170 |
| quarterly.values.rl_minus_g_gross | Real loan rate minus growth, before costs | Percent a year | prime − infl_cpi − g_real | 1959-01-01 | 2026-07-01 | 271 |
| quarterly.values.rl_minus_g | Real loan rate minus growth, after costs (gross costs) | Percent a year | rl_minus_g_gross − cost_assets_gross of the year | 1959-01-01 | 2025-10-01 | 268 |
| quarterly.values.rl_minus_g_net | Real loan rate minus growth, after costs (net of noninterest income) | Percent a year | rl_minus_g_gross − cost_assets_net of the year | 1959-01-01 | 2025-10-01 | 268 |
| quarterly.values.spread_l_d | Loan–deposit spread after costs (gross costs) | Percentage points a year | rl_minus_g − rd_minus_g | 1959-04-01 | 2025-10-01 | 267 |
| quarterly.values.spread_l_d_net | Loan–deposit spread after costs (net costs) | Percentage points a year | rl_minus_g_net − rd_minus_g | 1959-04-01 | 2025-10-01 | 267 |
| quarterly.values.m2_gdp | M2 / nominal GDP | Ratio | quarterly average of M2 / nominal GDP at an annual rate | 1959-01-01 | 2026-07-01 | 271 |
| quarterly.values.bank_lev_h8 | Bank leverage, H.8: total liabilities / residual | Ratio | quarterly average of weekly total liabilities / quarterly average of weekly residual | 1973-01-01 | 2026-07-01 | 215 |
| quarterly.values.bank_lev_qbp | Bank leverage, FDIC QBP: liabilities / equity | Ratio | (assets − equity) / equity, end of quarter | 1984-01-01 | 2026-07-01 | 171 |
| quarterly.values.bank_roe_qbp | Bank return on equity (FDIC QBP), nominal | Percent a year | 400 × net income of the quarter / average equity | 1984-04-01 | 2026-07-01 | 170 |
| quarterly.values.cost_assets_gross_qbp | Noninterest expense / average assets (FDIC QBP) | Percent a year | 400 × noninterest expense of the quarter / average assets | 1984-04-01 | 2026-07-01 | 170 |
| quarterly.values.cost_assets_net_qbp | Net noninterest expense / average assets (FDIC QBP) | Percent a year | 400 × (noninterest expense − noninterest income) of the quarter / average assets | 1984-04-01 | 2026-07-01 | 170 |
| quarterly.values.corp_lev_z1_bv | Nonfinancial corporate debt / net worth, book (historical cost) | Ratio | NCBCMDPNWHC / 100 | 1959-01-01 | 2026-04-01 | 270 |
| quarterly.values.corp_lev_z1_mv | Nonfinancial corporate debt / net worth, market value | Ratio | NCBCMDPNWMV / 100 | 1959-01-01 | 2026-04-01 | 270 |
| quarterly.values.ref_an_lev | Aoki–Nikolov: 10 |  | constant: value of Aoki and Nikolov (2015, Table 1) | 1959-01-01 | 2026-07-01 | 271 |
| quarterly.values.ref_an_roe | Aoki–Nikolov: 10% |  | constant: value of Aoki and Nikolov (2015, Table 1) | 1959-01-01 | 2026-07-01 | 271 |
| quarterly.values.ref_an_m2 | Aoki–Nikolov: 0.50 |  | constant: value of Aoki and Nikolov (2015, Table 1) | 1959-01-01 | 2026-07-01 | 271 |
| quarterly.values.ref_an_corp | Aoki–Nikolov: 0.50 |  | constant: value of Aoki and Nikolov (2015, Table 1) | 1959-01-01 | 2026-07-01 | 271 |
| quarterly.values.rd_minus_g_mean_rep | Mean 1959–2012, deposit rate | Percent a year | mean of rd_minus_g over 1959 Q1–2012 Q4 (null outside) | 1959-01-01 | 2012-10-01 | 216 |
| quarterly.values.rl_minus_g_gross_mean_rep | Mean 1959–2012, loan rate before costs | Percent a year | mean of rl_minus_g_gross over 1959 Q1–2012 Q4 (null outside) | 1959-01-01 | 2012-10-01 | 216 |
| quarterly.values.rl_minus_g_mean_rep | Mean 1959–2012, loan rate after costs | Percent a year | mean of rl_minus_g over 1959 Q1–2012 Q4 (null outside) | 1959-01-01 | 2012-10-01 | 216 |
| annual.values.bank_lev_fdic | Bank leverage, FDIC: total liabilities / equity capital | Ratio | total liabilities / equity capital, end of year | 1934-01-01 | 2025-01-01 | 92 |
| annual.values.bank_roe | Bank return on equity (FDIC), nominal | Percent a year | 100 × net income / average equity (end of year and previous year) | 1935-01-01 | 2025-01-01 | 91 |
| annual.values.bank_roe_real_g | Bank return on equity minus inflation and growth | Percent a year | bank_roe − annual means of infl_cpi and g_real | 1948-01-01 | 2025-01-01 | 78 |
| annual.values.cost_assets_gross | Noninterest expense / average assets (FDIC) | Percent a year | 100 × noninterest expense / average assets | 1935-01-01 | 2025-01-01 | 91 |
| annual.values.cost_assets_net | Noninterest expense less noninterest income / average assets (FDIC) | Percent a year | 100 × (noninterest expense − noninterest income) / average assets | 1935-01-01 | 2025-01-01 | 91 |
| annual.values.dep_cost_fdic_cb | Effective deposit cost (FDIC, insured commercial banks, annual) | Percent a year | 100 × interest expense on deposits / average deposits (end of year and previous year) | 1935-01-01 | 2025-01-01 | 91 |
| annual.values.fdic_assets | Total assets (FDIC-insured commercial banks) | Billions of dollars | level as published | 1934-01-01 | 2025-01-01 | 92 |
| annual.values.fdic_liab | Total liabilities (FDIC-insured commercial banks) | Billions of dollars | level as published | 1934-01-01 | 2025-01-01 | 92 |
| annual.values.fdic_equity | Total equity capital (FDIC-insured commercial banks) | Billions of dollars | level as published | 1934-01-01 | 2025-01-01 | 92 |
| annual.values.fdic_net_income | Net income (FDIC-insured commercial banks) | Billions of dollars | level as published | 1934-01-01 | 2025-01-01 | 92 |
| annual.values.fdic_nonint_exp | Total noninterest expense (FDIC-insured commercial banks) | Billions of dollars | level as published | 1934-01-01 | 2025-01-01 | 92 |
| annual.values.fdic_nonint_inc | Total noninterest income (FDIC-insured commercial banks) | Billions of dollars | level as published | 1934-01-01 | 2025-01-01 | 92 |
| annual.values.fdic_dep_int | Interest expense on deposits (FDIC-insured commercial banks) | Billions of dollars | level as published | 1934-01-01 | 2025-01-01 | 92 |
| annual.values.fdic_deposits | Total deposits (FDIC-insured commercial banks) | Billions of dollars | level as published | 1934-01-01 | 2025-01-01 | 92 |
| annual.values.ref_an_lev | Aoki–Nikolov: 10 |  | constant: value of Aoki and Nikolov (2015, Table 1) | 1934-01-01 | 2025-01-01 | 92 |
| annual.values.ref_an_roe | Aoki–Nikolov: 10% |  | constant: value of Aoki and Nikolov (2015, Table 1) | 1934-01-01 | 2025-01-01 | 92 |

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: banks-credit |
| generated_at_utc | str: 2026-11-27T16:11:21+00:00 |
| country | values: code = US, name = United States |
| recessions | recession dates (peak, trough) used to shade the charts |
| variables.prime | values: label = Bank prime loan rate, units = Percent a year, digits = 2, source = FRB H.15 (MPRIME) via FRED (Federal Reserve Bank of St. Louis), method = quarterly average of monthly data |
| variables.m2_own | values: label = M2 own rate, units = Percent a year, digits = 2, source = Board of Governors of the Federal Reserve System, M2 own rate (M2OWN) via FRED (Federal Reserve Bank of St. Louis), method = quarterly average of monthly data |
| variables.dep_cost_qbp | values: label = Effective deposit cost (FDIC, all insured institutions), units = Percent a year, digits = 2, source = FDIC, Quarterly Banking Profile (all FDIC-insured institutions) via FRED (Federal Reserve Bank of St. Louis); author's calculation, method = 400 × interest expense on deposits of the … |
| variables.dep_cost_fdic_cb | values: label = Effective deposit cost (FDIC, insured commercial banks, annual), units = Percent a year, digits = 2, source = FDIC, Historical Statistics on Banking (FDIC-insured commercial banks), BankFind API; author's calculation, method = 100 × interest expense on deposits / average deposits (en … |
| variables.rd_nominal | values: label = Deposit rate (M2 own rate to 2019Q2, then FDIC deposit cost), units = Percent a year, digits = 2, source = FRED (FRB H.15, M2 own rate, BLS CPI-U, BEA GDP), FDIC; author's calculation, method = M2 own rate to 2019 Q2, then dep_cost_qbp |
| variables.infl_cpi | values: label = CPI-U inflation, year on year, units = Percent a year, digits = 2, source = U.S. Bureau of Labor Statistics, CPI-U (CPIAUCSL) via FRED (Federal Reserve Bank of St. Louis); author's calculation, method = quarterly average of 100 × (CPI_m / CPI_m−12 − 1) |
| variables.g_real | values: label = Real GDP growth, year on year, units = Percent a year, digits = 2, source = U.S. Bureau of Economic Analysis, real GDP (GDPC1) via FRED (Federal Reserve Bank of St. Louis); author's calculation, method = 100 × (GDPC1_t / GDPC1_t−4 − 1) |
| variables.rd_minus_g | values: label = Real deposit rate minus real GDP growth, units = Percent a year, digits = 2, source = FRED (FRB H.15, M2 own rate, BLS CPI-U, BEA GDP), FDIC; author's calculation, method = rd_nominal − infl_cpi − g_real |
| variables.rd_m2own_minus_g | values: label = Real deposit rate minus growth, M2 own rate (to 2019Q2), units = Percent a year, digits = 2, source = FRED (FRB H.15, M2 own rate, BLS CPI-U, BEA GDP), FDIC; author's calculation, method = m2_own − infl_cpi − g_real |
| variables.rd_fdic_minus_g | values: label = Real deposit rate minus growth, FDIC deposit cost, units = Percent a year, digits = 2, source = FRED (FRB H.15, M2 own rate, BLS CPI-U, BEA GDP), FDIC; author's calculation, method = dep_cost_qbp − infl_cpi − g_real |
| variables.rl_minus_g_gross | values: label = Real loan rate minus growth, before costs, units = Percent a year, digits = 2, source = FRED (FRB H.15, M2 own rate, BLS CPI-U, BEA GDP), FDIC; author's calculation, method = prime − infl_cpi − g_real |
| variables.rl_minus_g | values: label = Real loan rate minus growth, after costs (gross costs), units = Percent a year, digits = 2, source = FRED (FRB H.15, M2 own rate, BLS CPI-U, BEA GDP), FDIC; author's calculation, method = rl_minus_g_gross − cost_assets_gross of the year |
| variables.rl_minus_g_net | values: label = Real loan rate minus growth, after costs (net of noninterest income), units = Percent a year, digits = 2, source = FRED (FRB H.15, M2 own rate, BLS CPI-U, BEA GDP), FDIC; author's calculation, method = rl_minus_g_gross − cost_assets_net of the year |
| variables.spread_l_d | values: label = Loan–deposit spread after costs (gross costs), units = Percentage points a year, digits = 2, source = FRED (FRB H.15, M2 own rate, BLS CPI-U, BEA GDP), FDIC; author's calculation, method = rl_minus_g − rd_minus_g |
| variables.spread_l_d_net | values: label = Loan–deposit spread after costs (net costs), units = Percentage points a year, digits = 2, source = FRED (FRB H.15, M2 own rate, BLS CPI-U, BEA GDP), FDIC; author's calculation, method = rl_minus_g_net − rd_minus_g |
| variables.m2_gdp | values: label = M2 / nominal GDP, units = Ratio, digits = 3, source = Board of Governors, M2 (M2SL); BEA, GDP via FRED (Federal Reserve Bank of St. Louis); author's calculation, method = quarterly average of M2 / nominal GDP at an annual rate |
| variables.bank_lev_h8 | values: label = Bank leverage, H.8: total liabilities / residual, units = Ratio, digits = 2, source = Board of Governors of the Federal Reserve System, H.8 (all commercial banks, not seasonally adjusted) via FRED (Federal Reserve Bank of St. Louis); author's calculation, method = quarterly average o … |
| variables.bank_lev_qbp | values: label = Bank leverage, FDIC QBP: liabilities / equity, units = Ratio, digits = 2, source = FDIC, Quarterly Banking Profile (all FDIC-insured institutions) via FRED (Federal Reserve Bank of St. Louis); author's calculation, method = (assets − equity) / equity, end of quarter |
| variables.bank_lev_fdic | values: label = Bank leverage, FDIC: total liabilities / equity capital, units = Ratio, digits = 2, source = FDIC, Historical Statistics on Banking (FDIC-insured commercial banks), BankFind API; author's calculation, method = total liabilities / equity capital, end of year |
| variables.bank_roe | values: label = Bank return on equity (FDIC), nominal, units = Percent a year, digits = 2, source = FDIC, Historical Statistics on Banking (FDIC-insured commercial banks), BankFind API; author's calculation, method = 100 × net income / average equity (end of year and previous year) |
| variables.bank_roe_real_g | values: label = Bank return on equity minus inflation and growth, units = Percent a year, digits = 2, source = FRED (FRB H.15, M2 own rate, BLS CPI-U, BEA GDP), FDIC; author's calculation, method = bank_roe − annual means of infl_cpi and g_real |
| variables.bank_roe_qbp | values: label = Bank return on equity (FDIC QBP), nominal, units = Percent a year, digits = 2, source = FDIC, Quarterly Banking Profile (all FDIC-insured institutions) via FRED (Federal Reserve Bank of St. Louis); author's calculation, method = 400 × net income of the quarter / average equity |
| variables.cost_assets_gross | values: label = Noninterest expense / average assets (FDIC), units = Percent a year, digits = 2, source = FDIC, Historical Statistics on Banking (FDIC-insured commercial banks), BankFind API; author's calculation, method = 100 × noninterest expense / average assets |
| variables.cost_assets_net | values: label = Noninterest expense less noninterest income / average assets (FDIC), units = Percent a year, digits = 2, source = FDIC, Historical Statistics on Banking (FDIC-insured commercial banks), BankFind API; author's calculation, method = 100 × (noninterest expense − noninterest income) / av … |
| variables.cost_assets_gross_qbp | values: label = Noninterest expense / average assets (FDIC QBP), units = Percent a year, digits = 2, source = FDIC, Quarterly Banking Profile (all FDIC-insured institutions) via FRED (Federal Reserve Bank of St. Louis); author's calculation, method = 400 × noninterest expense of the quarter / averag … |
| variables.cost_assets_net_qbp | values: label = Net noninterest expense / average assets (FDIC QBP), units = Percent a year, digits = 2, source = FDIC, Quarterly Banking Profile (all FDIC-insured institutions) via FRED (Federal Reserve Bank of St. Louis); author's calculation, method = 400 × (noninterest expense − noninterest inco … |
| variables.corp_lev_z1_bv | values: label = Nonfinancial corporate debt / net worth, book (historical cost), units = Ratio, digits = 3, source = Board of Governors of the Federal Reserve System, Financial Accounts of the United States (Z.1), B.103 via FRED (Federal Reserve Bank of St. Louis), method = NCBCMDPNWHC / 100 |
| variables.corp_lev_z1_mv | values: label = Nonfinancial corporate debt / net worth, market value, units = Ratio, digits = 3, source = Board of Governors of the Federal Reserve System, Financial Accounts of the United States (Z.1), B.103 via FRED (Federal Reserve Bank of St. Louis), method = NCBCMDPNWMV / 100 |
| variables.fdic_assets | values: label = Total assets (FDIC-insured commercial banks), units = Billions of dollars, digits = 1, source = FDIC, Historical Statistics on Banking (FDIC-insured commercial banks), BankFind API |
| variables.fdic_liab | values: label = Total liabilities (FDIC-insured commercial banks), units = Billions of dollars, digits = 1, source = FDIC, Historical Statistics on Banking (FDIC-insured commercial banks), BankFind API |
| variables.fdic_equity | values: label = Total equity capital (FDIC-insured commercial banks), units = Billions of dollars, digits = 1, source = FDIC, Historical Statistics on Banking (FDIC-insured commercial banks), BankFind API |
| variables.fdic_net_income | values: label = Net income (FDIC-insured commercial banks), units = Billions of dollars, digits = 1, source = FDIC, Historical Statistics on Banking (FDIC-insured commercial banks), BankFind API |
| variables.fdic_nonint_exp | values: label = Total noninterest expense (FDIC-insured commercial banks), units = Billions of dollars, digits = 1, source = FDIC, Historical Statistics on Banking (FDIC-insured commercial banks), BankFind API |
| variables.fdic_nonint_inc | values: label = Total noninterest income (FDIC-insured commercial banks), units = Billions of dollars, digits = 1, source = FDIC, Historical Statistics on Banking (FDIC-insured commercial banks), BankFind API |
| variables.fdic_dep_int | values: label = Interest expense on deposits (FDIC-insured commercial banks), units = Billions of dollars, digits = 1, source = FDIC, Historical Statistics on Banking (FDIC-insured commercial banks), BankFind API |
| variables.fdic_deposits | values: label = Total deposits (FDIC-insured commercial banks), units = Billions of dollars, digits = 1, source = FDIC, Historical Statistics on Banking (FDIC-insured commercial banks), BankFind API |
| variables.ref_an_lev | values: label = Aoki–Nikolov: 10, units = , digits = 2, reference = True, source = Aoki, K. and K. Nikolov (2015), Bubbles, banks and financial stability, Journal of Monetary Economics 74, 33–51, Table 1, method = constant: value of Aoki and Nikolov (2015, Table 1) |
| variables.ref_an_roe | values: label = Aoki–Nikolov: 10%, units = , digits = 2, reference = True, source = Aoki, K. and K. Nikolov (2015), Bubbles, banks and financial stability, Journal of Monetary Economics 74, 33–51, Table 1, method = constant: value of Aoki and Nikolov (2015, Table 1) |
| variables.ref_an_m2 | values: label = Aoki–Nikolov: 0.50, units = , digits = 2, reference = True, source = Aoki, K. and K. Nikolov (2015), Bubbles, banks and financial stability, Journal of Monetary Economics 74, 33–51, Table 1, method = constant: value of Aoki and Nikolov (2015, Table 1) |
| variables.ref_an_corp | values: label = Aoki–Nikolov: 0.50, units = , digits = 2, reference = True, source = Aoki, K. and K. Nikolov (2015), Bubbles, banks and financial stability, Journal of Monetary Economics 74, 33–51, Table 1, method = constant: value of Aoki and Nikolov (2015, Table 1) |
| variables.rd_minus_g_mean_rep | values: label = Mean 1959–2012, deposit rate, units = Percent a year, digits = 2, reference = True, ref_of = rd_minus_g, source = FRED (FRB H.15, M2 own rate, BLS CPI-U, BEA GDP), FDIC; author's calculation, method = mean of rd_minus_g over 1959 Q1–2012 Q4 (null outside) |
| variables.rl_minus_g_gross_mean_rep | values: label = Mean 1959–2012, loan rate before costs, units = Percent a year, digits = 2, reference = True, ref_of = rl_minus_g_gross, source = FRED (FRB H.15, M2 own rate, BLS CPI-U, BEA GDP), FDIC; author's calculation, method = mean of rl_minus_g_gross over 1959 Q1–2012 Q4 (null outside) |
| variables.rl_minus_g_mean_rep | values: label = Mean 1959–2012, loan rate after costs, units = Percent a year, digits = 2, reference = True, ref_of = rl_minus_g, source = FRED (FRB H.15, M2 own rate, BLS CPI-U, BEA GDP), FDIC; author's calculation, method = mean of rl_minus_g over 1959 Q1–2012 Q4 (null outside) |
| bbr_targets.samples | table of 4 rows; fields: id, from, to |
| bbr_targets.rows | table of 18 rows; fields: id, name, unit_code, freq, role, method, source, data_key, an_value, an_gross, samples, default_sample |
| bbr_targets.inputs | table of 5 rows; fields: id, name, samples |
| deposit_overlap | values: first = 1984 Q2, last = 2019 Q2, n = 141, corr = 0.994097, mean_m2own = 2.37178, mean_fdic = 3.00939, mean_gap = 0.637609, sd_gap = 0.340108 |
| h8_breaks | table of 3 rows; fields: quarter, change_pct, level_before, level, note |
| consistency | table of 5 rows; fields: case, R_l, R_d, D_N, ROE, roe_concept, roe_floor, gamma_implied, holds |
| checks_request | table of 16 rows; fields: series, from, to, used, site, expected, gap, status |
| source_info.fdic_years | str: 1934–2025 |
| source_info.qbp | list: qbp_assets, qbp_dep_int_dom, qbp_dep_int_for, qbp_deposits, qbp_equity, qbp_net_income, qbp_nonint_exp, qbp_nonint_inc |
| downloads | values: quarterly_csv = downloads/economics/us/us-banks-credit-quarterly.csv, annual_csv = downloads/economics/us/us-banks-credit-annual.csv, mat = downloads/economics/us/us-banks-credit.mat |
| crisis_frequency.about | str: Stage 1 of the calibration of π (bubble survival, decision D7): the annual frequ |
| crisis_frequency.rows | table of 6 rows; fields: source, scope, sample, crises, years, frequency, pi_implied, years_per_crisis |
| crisis_frequency.us_crises.JST | list: 1873, 1893, 1907, 1930, 1984, 2007 |
| crisis_frequency.jst_countries | int: 18 |
| crisis_frequency.jst_reference | str: Jordà, Ò., M. Schularick and A. M. Taylor (2017), Macrofinancial History and the |
