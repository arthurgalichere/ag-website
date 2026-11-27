# Data dictionary: investor-sentiment.json

File: https://arthurgalichere.com/assets/data/economics/us/investor-sentiment.json (generated 2026-11-27T16:11:11+00:00 UTC). Missing values are JSON null. Dates are the first day of the period (quarter, month or year). When a series exists in several versions, one row covers them, with a placeholder in the path: . First and last dates marked (varies) differ across those versions.

## Series

| path | meaning | units | transformation | first | last | n |
|---|---|---|---|---|---|---|
| quarterly.values.sent | Investor sentiment (SENT) | Standardised index | level as published | 1965-07-01 | 2025-10-01 | 242 |
| quarterly.values.sent_orth | Investor sentiment, orthogonalised (SENT⊥) | Standardised index | level as published | 1965-07-01 | 2025-10-01 | 242 |
| quarterly.values.cefd | Closed-end fund discount | Percent | level as published | 1965-07-01 | 2025-10-01 | 242 |
| quarterly.values.pdnd | Dividend premium | Log difference ×100 | level as published | 1960-04-01 | 2025-10-01 | 263 |
| quarterly.values.eq_share | Equity share of new issues | Percent of equity and debt issues, past 12 months | level as published | 1958-10-01 | 2025-10-01 | 269 |
| quarterly.values.nipo | Number of IPOs | Per quarter | level as published | 1960-01-01 | 2025-10-01 | 264 |
| quarterly.values.ripo | First-day return of IPOs | Percent, IPO-weighted | level as published | 1960-01-01 | 2025-10-01 | 262 |
| quarterly.values.eq_issues | Gross equity issues | Billions of dollars per quarter | level as published | 1958-01-01 | 2010-10-01 | 212 |
| quarterly.values.debt_issues | Gross debt issues | Billions of dollars per quarter | level as published | 1958-01-01 | 2010-10-01 | 212 |
| quarterly.values.mv | Market value of nonfinancial corporate equities | Trillions of dollars | level as published | 1945-10-01 | 2026-04-01 | 305 |
| quarterly.values.iss_gross | Gross equity issues / market value (cash raised by all issuers) | Percent per quarter | level as published | 1958-01-01 | 2010-10-01 | 212 |
| quarterly.values.iss_net | Net equity issuance / market value | Percent per quarter | level as published | 1952-01-01 | 2026-04-01 | 298 |
| quarterly.values.gdp_q | Real GDP | Billions of chained 2017 dollars | level as published | 1947-01-01 | 2026-04-01 | 318 |
| quarterly.cycles.sent | Investor sentiment (SENT) | Standardised index | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1965-07-01 | 2025-10-01 | 242 |
| quarterly.cycles.sent_orth | Investor sentiment, orthogonalised (SENT⊥) | Standardised index | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1965-07-01 | 2025-10-01 | 242 |
| quarterly.cycles.nipo | Number of IPOs | Per quarter | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1960-01-01 | 2025-10-01 | 264 |
| quarterly.cycles.ripo | First-day return of IPOs | Percent, IPO-weighted | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1960-01-01 | 2025-10-01 | 262 |
| quarterly.cycles.eq_share | Equity share of new issues | Percent of equity and debt issues, past 12 months | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1958-10-01 | 2025-10-01 | 269 |
| quarterly.cycles.iss_gross | Gross equity issues / market value (cash raised by all issuers) | Percent per quarter | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1958-01-01 | 2010-10-01 | 212 |
| quarterly.cycles.iss_net | Net equity issuance / market value | Percent per quarter | cycle of the level (deviation from trend, in the units shown); HP filter, λ 1600 | 1952-01-01 | 2026-04-01 | 298 |
| quarterly.cycles.mv | Market value of nonfinancial corporate equities | Trillions of dollars | cycle of 100 × log (percent deviation from trend); HP filter, λ 1600 | 1945-10-01 | 2026-04-01 | 305 |
| quarterly.cycles.gdp_q | Real GDP | Billions of chained 2017 dollars | cycle of 100 × log (percent deviation from trend); HP filter, λ 1600 | 1947-01-01 | 2026-04-01 | 318 |
| annual.values.n_ipo | Number of IPOs | Per year | level as published | 1980-01-01 | 2025-01-01 | 46 |
| annual.values.proceeds | IPO proceeds | Billions of dollars | level as published | 1980-01-01 | 2025-01-01 | 46 |
| annual.values.mv_ipo | Market value of IPOs at the first closing price | Billions of dollars | level as published | 1980-01-01 | 2025-01-01 | 46 |
| annual.values.fdr_ew | First-day return of IPOs, equal-weighted | Percent | level as published | 1980-01-01 | 2025-01-01 | 46 |
| annual.values.fdr_pw | First-day return of IPOs, proceeds-weighted | Percent | level as published | 1980-01-01 | 2025-01-01 | 46 |
| annual.values.eps_ipo_a | IPOs / all nonfinancial corporate equities (Z.1) | Percent of market value, per year | level as published | 1980-01-01 | 2025-01-01 | 46 |
| annual.values.eps_ipo_pub_a | IPOs / public corporate equities (Z.1) | Percent of market value, per year | level as published | 1980-01-01 | 2025-01-01 | 46 |
| annual.values.mv_listed | Market capitalisation of listed domestic companies | Trillions of dollars, end of year | level as published | 1980-01-01 | 2025-01-01 | 46 |
| annual.values.eps_ipo_listed_a | IPOs / listed domestic companies (WFE) | Percent of market value, per year | level as published | 1980-01-01 | 2025-01-01 | 46 |
| annual.values.eps_ipo_offer_a | IPOs at the offer price / all nonfinancial corporate equities (Z.1) | Percent of market value, per year | level as published | 1980-01-01 | 2025-01-01 | 46 |
| annual.values.gross_issues | Gross equity issues (Federal Reserve Bulletin) | Billions of dollars | level as published | 1980-01-01 | 2010-01-01 | 31 |
| annual.values.ipo_share_gross | IPO proceeds / gross equity issues | Percent | level as published | 1980-01-01 | 2010-01-01 | 31 |

## Other blocks (statistics, tables, settings)

Values shown for the first version when a block repeats (placeholders as above).

| path | content |
|---|---|
| dashboard | str: investor-sentiment |
| generated_at_utc | str: 2026-11-27T16:11:11+00:00 |
| country | values: code = US, name = United States |
| recessions | recession dates (peak, trough) used to shade the charts |
| source | values: url = https://pages.stern.nyu.edu/~jwurgler/data/SENTIMENT.xlsx, from_cache = False, updated = March, 2026, last_month = 2025-12 |
| variables.sent | values: label = Investor sentiment (SENT), units = Standardised index, transform = none, digits = 2, source = Baker and Wurgler, investor sentiment data (current file); IPO data from Jay Ritter |
| variables.sent_orth | values: label = Investor sentiment, orthogonalised (SENT⊥), units = Standardised index, transform = none, digits = 2, source = Baker and Wurgler, investor sentiment data (current file); IPO data from Jay Ritter |
| variables.nipo | values: label = Number of IPOs, units = Per quarter, transform = level, digits = 0, source = Baker and Wurgler, investor sentiment data (current file); IPO data from Jay Ritter |
| variables.ripo | values: label = First-day return of IPOs, units = Percent, IPO-weighted, transform = level, digits = 1, source = Baker and Wurgler, investor sentiment data (current file); IPO data from Jay Ritter |
| variables.cefd | values: label = Closed-end fund discount, units = Percent, transform = level, digits = 1, source = Baker and Wurgler, investor sentiment data (current file); IPO data from Jay Ritter |
| variables.pdnd | values: label = Dividend premium, units = Log difference ×100, transform = level, digits = 1, source = Baker and Wurgler, investor sentiment data (current file); IPO data from Jay Ritter |
| variables.eq_share | values: label = Equity share of new issues, units = Percent of equity and debt issues, past 12 months, transform = level, digits = 1, source = Baker and Wurgler, investor sentiment data (current file); IPO data from Jay Ritter |
| variables.eq_issues | values: label = Gross equity issues, units = Billions of dollars per quarter, transform = log, digits = 1, source = Baker and Wurgler, investor sentiment data (2011 file; Federal Reserve Bulletin) |
| variables.debt_issues | values: label = Gross debt issues, units = Billions of dollars per quarter, transform = log, digits = 1, source = Baker and Wurgler, investor sentiment data (2011 file; Federal Reserve Bulletin) |
| variables.mv | values: label = Market value of nonfinancial corporate equities, units = Trillions of dollars, transform = log, digits = 2, source = Board of Governors of the Federal Reserve System, Financial Accounts of the United States (Z.1) (NCBEILQ027S) via FRED (Federal Reserve Bank of St. Louis) |
| variables.iss_gross | values: label = Gross equity issues / market value (cash raised by all issuers), units = Percent per quarter, transform = level, digits = 3, source = Baker and Wurgler, investor sentiment data (2011 file) and Board of Governors of the Federal Reserve System, Financial Accounts of the United States ( … |
| variables.iss_net | values: label = Net equity issuance / market value, units = Percent per quarter, transform = level, digits = 3, source = Board of Governors of the Federal Reserve System, Financial Accounts of the United States (Z.1) (NCBCEBQ027S, NCBEILQ027S) via FRED (Federal Reserve Bank of St. Louis); author's c … |
| variables.gdp_q | values: label = Real GDP, units = Billions of chained 2017 dollars, transform = log, digits = 0, source = U.S. Bureau of Economic Analysis (GDPC1) via FRED (Federal Reserve Bank of St. Louis) |
| variables.n_ipo | values: label = Number of IPOs, units = Per year, transform = level, digits = 0, source = Jay R. Ritter, Initial Public Offerings: Updated Statistics (University of Florida), Tables 1 and 1a |
| variables.proceeds | values: label = IPO proceeds, units = Billions of dollars, transform = level, digits = 2, source = Jay R. Ritter, Initial Public Offerings: Updated Statistics (University of Florida), Tables 1 and 1a |
| variables.mv_ipo | values: label = Market value of IPOs at the first closing price, units = Billions of dollars, transform = level, digits = 1, source = Jay R. Ritter, Initial Public Offerings: Updated Statistics (University of Florida), Tables 1 and 1a |
| variables.fdr_ew | values: label = First-day return of IPOs, equal-weighted, units = Percent, transform = level, digits = 1, source = Jay R. Ritter, Initial Public Offerings: Updated Statistics (University of Florida), Tables 1 and 1a |
| variables.fdr_pw | values: label = First-day return of IPOs, proceeds-weighted, units = Percent, transform = level, digits = 1, source = Jay R. Ritter, Initial Public Offerings: Updated Statistics (University of Florida), Tables 1 and 1a |
| variables.eps_ipo_a | values: label = IPOs / all nonfinancial corporate equities (Z.1), units = Percent of market value, per year, transform = level, digits = 2, source = Jay R. Ritter, Initial Public Offerings: Updated Statistics (University of Florida), Tables 1 and 1a; Board of Governors of the Federal Reserve System, … |
| variables.eps_ipo_pub_a | values: label = IPOs / public corporate equities (Z.1), units = Percent of market value, per year, transform = level, digits = 2, source = Jay R. Ritter, Initial Public Offerings: Updated Statistics (University of Florida), Tables 1 and 1a; Board of Governors of the Federal Reserve System, Financial … |
| variables.eps_ipo_listed_a | values: label = IPOs / listed domestic companies (WFE), units = Percent of market value, per year, transform = level, digits = 2, source = Jay R. Ritter, Initial Public Offerings: Updated Statistics (University of Florida), Tables 1 and 1a; World Federation of Exchanges via the World Bank (CM.MKT.LC … |
| variables.eps_ipo_offer_a | values: label = IPOs at the offer price / all nonfinancial corporate equities (Z.1), units = Percent of market value, per year, transform = level, digits = 2, source = Jay R. Ritter, Initial Public Offerings: Updated Statistics (University of Florida), Tables 1 and 1a; Board of Governors of the Fede … |
| variables.gross_issues | values: label = Gross equity issues (Federal Reserve Bulletin), units = Billions of dollars, transform = level, digits = 1, source = Baker and Wurgler, investor sentiment data (2011 file; Federal Reserve Bulletin) |
| variables.ipo_share_gross | values: label = IPO proceeds / gross equity issues, units = Percent, transform = level, digits = 1, source = Jay R. Ritter, Initial Public Offerings: Updated Statistics (University of Florida), Tables 1 and 1a; Baker and Wurgler, investor sentiment data (2011 file; Federal Reserve Bulletin); author' … |
| variables.mv_listed | values: label = Market capitalisation of listed domestic companies, units = Trillions of dollars, end of year, transform = level, digits = 2, source = World Federation of Exchanges via the World Bank (CM.MKT.LCAP.CD) |
| quarterly.stats | table of 11 rows; fields: key, mean, sd, min, min_period, max, max_period, latest, latest_period, mean_10, start, end |
| quarterly.cycle_stats.lags | list: -4, -3, -2, -1, 0, 1, 2, 3, 4 |
| quarterly.cycle_stats.rows | table of 8 rows; fields: key, sd, ar1, rel_sd, start, end, n, corr, peak_lag |
| targets | table of 7 rows; fields: key, label, value, digits, units, sample, note |
| downloads | values: ipo_csv = downloads/economics/us/us-investor-sentiment-ipo-annual.csv, quarterly_csv = downloads/economics/us/us-investor-sentiment-quarterly.csv, monthly_csv = downloads/economics/us/us-investor-sentiment-monthly.csv, mat = downloads/economics/us/us-investor-sentiment.mat |
| annual.source.dates | values: table_1 = July 13, 2026, table_1a = March 17, 2026, document = November 5, 2026 |
| entry_value | table of 5 rows; fields: key, data_key, label, symbol, annual, quarterly, value, subperiods, sample, units, digits, formula |
