/**
 * State Home Loan Centre - Interactive Financial Calculators Engine
 * Replicates the Quickli Calculators on Azura Financial:
 * 1. Borrowing Capacity Calculator
 * 2. Loan Repayments Calculator
 * 3. Refinance & Extra Repayments Calculator
 * 4. Stamp Duty Calculator (Accurate Australian State Rates)
 * 5. Purchasing Power & Deposit Calculator
 */

(function () {
    'use strict';

    // Formatting helper functions
    const fmt = (num) => new Intl.NumberFormat('en-AU', { maximumFractionDigits: 0 }).format(Math.round(num || 0));
    const fmtCurr = (num) => '$' + fmt(num);
    const uncomma = (str) => parseFloat(String(str).replace(/[^0-9.-]/g, '')) || 0;

    // State object
    const state = {
        activeTab: 'borrowing', // 'borrowing', 'repayment', 'refinance', 'stampduty', 'savings'
        
        // Borrowing Capacity
        borrowing: {
            applicantType: 'single', // 'single' | 'joint'
            purpose: 'owner', // 'owner' | 'investment'
            dependants: 0,
            step: 'details', // 'details' | 'income' | 'expenses'
            income1: 125000,
            income2: 85000,
            rentalIncome: 0,
            otherIncome: 0,
            livingExpenses: 2800,
            creditCardLimit: 6000,
            otherLoans: 0,
            repaymentType: 'pi', // 'pi' | 'io'
            frequency: 'monthly',
            termYears: 30,
            interestRate: 5.93,
            maxBorrowing: 750000,
            adjustedBorrowing: 750000
        },

        // Loan Repayments
        repayment: {
            loanAmount: 850000,
            termYears: 30,
            interestRate: 5.99,
            repaymentType: 'pi',
            frequency: 'monthly'
        },

        // Refinance & Extra Repayments
        refinance: {
            currentBalance: 700000,
            remainingYears: 25,
            interestRate: 6.24,
            extraMonthly: 400,
            lumpSum: 0,
            frequency: 'monthly'
        },

        // Stamp Duty
        stampDuty: {
            state: 'NSW',
            price: 950000,
            buyerType: 'first_home', // 'first_home' | 'owner' | 'investor'
            propType: 'established' // 'established' | 'new' | 'land'
        },

        // Purchasing Power & Savings
        savings: {
            targetPrice: 1000000,
            currentDeposit: 140000,
            monthlySavings: 2500,
            interestRate: 4.85
        }
    };

    // Calculate Australian Income Tax (2024-2025/2026 Stage 3 revised rates)
    function calcNetAnnualIncome(gross) {
        if (gross <= 18200) return gross;
        let tax = 0;
        if (gross <= 45000) {
            tax = (gross - 18200) * 0.16;
        } else if (gross <= 135000) {
            tax = 4288 + (gross - 45000) * 0.30;
        } else if (gross <= 190000) {
            tax = 31288 + (gross - 135000) * 0.37;
        } else {
            tax = 51638 + (gross - 190000) * 0.45;
        }
        // Medicare levy 2%
        const medicare = gross > 26000 ? gross * 0.02 : 0;
        return Math.max(0, gross - (tax + medicare));
    }

    // Standard Loan Repayment Formula (Monthly P&I)
    function calcMonthlyPayment(principal, annualRate, termYears) {
        if (principal <= 0) return 0;
        const r = (annualRate / 100) / 12;
        const n = termYears * 12;
        if (r === 0) return principal / n;
        return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    // 1. Borrowing Capacity Calculation (APRA standard + 3% buffer)
    function updateBorrowingCapacity() {
        const b = state.borrowing;
        
        // 1. Net monthly income
        let netAnnual = calcNetAnnualIncome(b.income1);
        if (b.applicantType === 'joint') {
            netAnnual += calcNetAnnualIncome(b.income2);
        }
        // Shaded rental income (80%) + other income (80%)
        netAnnual += (b.rentalIncome * 0.80) + (b.otherIncome * 0.80);
        const netMonthly = netAnnual / 12;

        // 2. Commitments & Living expenses
        // HEM baseline proxy: $1800 for single, $2800 for couple + $450/dependant
        const baseHem = b.applicantType === 'joint' ? 2800 : 1800;
        const depAllowance = b.dependants * 450;
        const assessedLiving = Math.max(b.livingExpenses, baseHem + depAllowance);

        // Credit cards assessed at 3.8% of limit per month
        const creditCardAssessment = (b.creditCardLimit || 0) * 0.038;
        const totalMonthlyExpenses = assessedLiving + creditCardAssessment + (b.otherLoans || 0);

        // 3. Uncommitted monthly income
        const uncommittedMonthly = Math.max(0, netMonthly - totalMonthlyExpenses);

        // 4. Assessment rate = Actual rate + 3.00% APRA buffer (min 8.50%)
        const assessmentRate = Math.max(8.50, b.interestRate + 3.00);
        const rAssess = (assessmentRate / 100) / 12;
        const n = b.termYears * 12;

        // Borrowing Capacity formula: PV of uncommitted cashflow at assessment rate
        let maxLoan = 0;
        if (rAssess > 0 && n > 0 && uncommittedMonthly > 0) {
            maxLoan = (uncommittedMonthly * (Math.pow(1 + rAssess, n) - 1)) / (rAssess * Math.pow(1 + rAssess, n));
            // Apply 0.95 conservative broker buffer
            maxLoan = Math.round((maxLoan * 0.95) / 5000) * 5000;
        }

        maxLoan = Math.max(100000, Math.min(maxLoan, 3500000));
        b.maxBorrowing = maxLoan;

        // If adjustedBorrowing exceeds max or is not set, sync it
        if (!b.adjustedBorrowing || b.adjustedBorrowing > b.maxBorrowing) {
            b.adjustedBorrowing = b.maxBorrowing;
        }

        // Calculate actual repayments on adjustedBorrowing at actual customer rate
        let monthlyRepayment = 0;
        if (b.repaymentType === 'io') {
            monthlyRepayment = b.adjustedBorrowing * ((b.interestRate / 100) / 12);
        } else {
            monthlyRepayment = calcMonthlyPayment(b.adjustedBorrowing, b.interestRate, b.termYears);
        }

        let displayedRepayment = monthlyRepayment;
        if (b.frequency === 'fortnightly') {
            displayedRepayment = (monthlyRepayment * 12) / 26;
        } else if (b.frequency === 'weekly') {
            displayedRepayment = (monthlyRepayment * 12) / 52;
        }

        // Render to DOM
        const maxDisplay = document.getElementById('az-borrow-max');
        const adjustSlider = document.getElementById('az-borrow-adjust-slider');
        const adjustVal = document.getElementById('az-borrow-adjust-val');
        const repayDisplay = document.getElementById('az-borrow-repay');
        const repayFreqSub = document.getElementById('az-borrow-freq-sub');

        const mCell = document.getElementById('az-borrow-monthly-cell');
        const fCell = document.getElementById('az-borrow-fortnightly-cell');
        const wCell = document.getElementById('az-borrow-weekly-cell');

        if (maxDisplay) maxDisplay.textContent = fmtCurr(b.maxBorrowing);
        if (adjustSlider) {
            adjustSlider.max = b.maxBorrowing;
            adjustSlider.value = b.adjustedBorrowing;
        }
        if (adjustVal) adjustVal.textContent = fmtCurr(b.adjustedBorrowing);
        if (repayDisplay) repayDisplay.textContent = fmtCurr(displayedRepayment);
        if (repayFreqSub) repayFreqSub.textContent = b.frequency.toUpperCase() + ' REPAYMENTS';

        if (mCell) mCell.textContent = fmtCurr(monthlyRepayment);
        if (fCell) fCell.textContent = fmtCurr((monthlyRepayment * 12) / 26);
        if (wCell) wCell.textContent = fmtCurr((monthlyRepayment * 12) / 52);
    }

    // 2. Loan Repayments Tab Calculations
    function updateLoanRepayments() {
        const r = state.repayment;
        const P = r.loanAmount;
        const rate = r.interestRate;
        const years = r.termYears;

        let monthly = 0;
        if (r.repaymentType === 'io') {
            monthly = P * ((rate / 100) / 12);
        } else {
            monthly = calcMonthlyPayment(P, rate, years);
        }

        const fortnightly = (monthly * 12) / 26;
        const weekly = (monthly * 12) / 52;
        const totalPayable = monthly * years * 12;
        const totalInterest = Math.max(0, totalPayable - P);

        // Update elements
        const elMonthly = document.getElementById('az-repay-monthly');
        const elFortnightly = document.getElementById('az-repay-fortnightly');
        const elWeekly = document.getElementById('az-repay-weekly');
        const elInterest = document.getElementById('az-repay-interest');
        const elTotal = document.getElementById('az-repay-total');

        if (elMonthly) elMonthly.textContent = fmtCurr(monthly);
        if (elFortnightly) elFortnightly.textContent = fmtCurr(fortnightly);
        if (elWeekly) elWeekly.textContent = fmtCurr(weekly);
        if (elInterest) elInterest.textContent = fmtCurr(totalInterest);
        if (elTotal) elTotal.textContent = fmtCurr(totalPayable);

        // Visual breakdown bar
        const barPrincipal = document.getElementById('az-repay-bar-principal');
        const barInterest = document.getElementById('az-repay-bar-interest');
        if (barPrincipal && barInterest && totalPayable > 0) {
            const pPct = ((P / totalPayable) * 100).toFixed(1);
            const iPct = ((totalInterest / totalPayable) * 100).toFixed(1);
            barPrincipal.style.width = pPct + '%';
            barInterest.style.width = iPct + '%';
        }
    }

    // 3. Extra Repayments & Refinance Savings Calculations
    function updateRefinanceSavings() {
        const ref = state.refinance;
        const balance = ref.currentBalance;
        const rate = ref.interestRate;
        const years = ref.remainingYears;
        const extra = ref.extraMonthly;
        const lumpSum = ref.lumpSum;

        const monthlyRate = (rate / 100) / 12;
        const baseMonthly = calcMonthlyPayment(balance, rate, years);

        // Base Loan run
        let baseTotalInterest = (baseMonthly * years * 12) - balance;

        // Accelerated Loan Run
        let currBalance = balance - lumpSum;
        let months = 0;
        let extraTotalInterest = 0;
        const totalMonthlyPaid = baseMonthly + extra;

        while (currBalance > 0 && months < years * 12) {
            months++;
            const interest = currBalance * monthlyRate;
            extraTotalInterest += interest;
            const principal = totalMonthlyPaid - interest;
            currBalance -= principal;
            if (currBalance <= 0) break;
        }

        const interestSaved = Math.max(0, baseTotalInterest - extraTotalInterest);
        const monthsSaved = Math.max(0, (years * 12) - months);
        const yearsSaved = Math.floor(monthsSaved / 12);
        const remMonths = monthsSaved % 12;

        let timeSavedStr = '';
        if (yearsSaved > 0 && remMonths > 0) {
            timeSavedStr = `${yearsSaved} yrs, ${remMonths} mos`;
        } else if (yearsSaved > 0) {
            timeSavedStr = `${yearsSaved} years`;
        } else {
            timeSavedStr = `${remMonths} months`;
        }

        const elSaved = document.getElementById('az-ref-saved');
        const elTime = document.getElementById('az-ref-time');
        const elNewTerm = document.getElementById('az-ref-newterm');

        if (elSaved) elSaved.textContent = fmtCurr(interestSaved);
        if (elTime) elTime.textContent = timeSavedStr;
        if (elNewTerm) elNewTerm.textContent = `${Math.floor(months / 12)} yrs ${months % 12} mos`;
    }

    // 4. Stamp Duty Calculation (NSW & Australian States)
    function calcNSWStampDuty(price, buyerType, propType) {
        // NSW First Home Buyers Assistance Scheme (FHBAS)
        if (buyerType === 'first_home') {
            if (propType === 'land') {
                if (price <= 350000) return 0;
                if (price < 450000) {
                    // Concession
                    return Math.round((price - 350000) * 0.089);
                }
            } else {
                // Existing or new home
                if (price <= 800000) return 0; // 100% Exemption
                if (price <= 1000000) {
                    // Concessional scale between $800k and $1M
                    const normalDuty = calcNSWStandardDuty(price);
                    const factor = (price - 800000) / 200000;
                    return Math.round(normalDuty * factor);
                }
            }
        }
        return calcNSWStandardDuty(price);
    }

    function calcNSWStandardDuty(price) {
        if (price <= 17000) return price * 0.0125;
        if (price <= 36000) return 212 + (price - 17000) * 0.015;
        if (price <= 97000) return 497 + (price - 36000) * 0.0175;
        if (price <= 356000) return 1565 + (price - 97000) * 0.035;
        if (price <= 1188000) return 10630 + (price - 356000) * 0.045;
        return 48070 + (price - 1188000) * 0.055;
    }

    function updateStampDuty() {
        const s = state.stampDuty;
        const price = s.price;
        
        let duty = 0;
        if (s.state === 'NSW') {
            duty = calcNSWStampDuty(price, s.buyerType, s.propType);
        } else if (s.state === 'VIC') {
            duty = price > 750000 ? price * 0.055 : price * 0.048;
            if (s.buyerType === 'first_home' && price <= 600000) duty = 0;
        } else if (s.state === 'QLD') {
            duty = price * 0.035;
            if (s.buyerType === 'first_home' && price <= 700000) duty = 0;
        } else {
            duty = price * 0.045;
        }

        const transferFee = 172;
        const mortgageRegFee = 172;
        const totalGovCosts = duty + transferFee + mortgageRegFee;

        // Calculate exemption savings if FHB
        const standardDuty = calcNSWStandardDuty(price);
        const fhbSavings = Math.max(0, standardDuty - duty);

        const elDuty = document.getElementById('az-sd-duty');
        const elTotal = document.getElementById('az-sd-total');
        const elSavings = document.getElementById('az-sd-savings');
        const elSavingsRow = document.getElementById('az-sd-savings-row');

        if (elDuty) elDuty.textContent = fmtCurr(duty);
        if (elTotal) elTotal.textContent = fmtCurr(totalGovCosts);
        if (elSavings) elSavings.textContent = fmtCurr(fhbSavings);
        if (elSavingsRow) {
            elSavingsRow.style.display = (s.buyerType === 'first_home' && fhbSavings > 0) ? 'flex' : 'none';
        }
    }

    // 5. Purchasing Power & Savings Calculation
    function updatePurchasingPower() {
        const sav = state.savings;
        const target = sav.targetPrice;
        const deposit = sav.currentDeposit;
        const monthly = sav.monthlySavings;
        const rate = sav.interestRate / 100 / 12;

        const needed20Pct = target * 0.20;
        const shortfall = Math.max(0, needed20Pct - deposit);

        let monthsTo20 = 0;
        if (shortfall > 0 && monthly > 0) {
            let cur = deposit;
            while (cur < needed20Pct && monthsTo20 < 360) {
                monthsTo20++;
                cur = cur * (1 + rate) + monthly;
            }
        }

        // Maximum purchase price with 20% deposit without LMI
        const maxPurchaseNoLMI = deposit * 5.0;
        // Maximum purchase price with 10% deposit (using LMI)
        const maxPurchaseLMI = deposit * 10.0;

        const elMaxNoLmi = document.getElementById('az-sav-max-nolmi');
        const elMaxLmi = document.getElementById('az-sav-max-lmi');
        const elTimeToGoal = document.getElementById('az-sav-time');

        if (elMaxNoLmi) elMaxNoLmi.textContent = fmtCurr(maxPurchaseNoLMI);
        if (elMaxLmi) elMaxLmi.textContent = fmtCurr(maxPurchaseLMI);
        if (elTimeToGoal) {
            if (shortfall === 0) {
                elTimeToGoal.textContent = 'Ready Now (20% Reached!)';
            } else {
                const y = Math.floor(monthsTo20 / 12);
                const m = monthsTo20 % 12;
                elTimeToGoal.textContent = `${y} yrs ${m} mos`;
            }
        }
    }

    // Setup Event Listeners
    function initCalculator() {
        // 1. Top Tab Switching
        const tabBtns = document.querySelectorAll('[data-az-tab]');
        const tabPanels = document.querySelectorAll('.az-calc-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-az-tab');
                state.activeTab = target;

                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                tabPanels.forEach(panel => {
                    panel.style.display = panel.id === `az-panel-${target}` ? 'block' : 'none';
                });

                // Trigger calculation of the active tab
                if (target === 'borrowing') updateBorrowingCapacity();
                if (target === 'repayment') updateLoanRepayments();
                if (target === 'refinance') updateRefinanceSavings();
                if (target === 'stampduty') updateStampDuty();
                if (target === 'savings') updatePurchasingPower();
            });
        });

        // 2. Substeps (Borrowing details/income/expenses)
        const stepBtns = document.querySelectorAll('[data-az-step]');
        stepBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const step = btn.getAttribute('data-az-step');
                state.borrowing.step = step;
                stepBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                document.querySelectorAll('.az-step-pane').forEach(pane => {
                    pane.style.display = pane.id === `az-step-${step}` ? 'block' : 'none';
                });
            });
        });

        // "Add Income" and "Add Expenses" buttons to proceed to next step
        const nextToIncome = document.getElementById('az-btn-next-income');
        if (nextToIncome) {
            nextToIncome.addEventListener('click', () => {
                const btn = document.querySelector('[data-az-step="income"]');
                if (btn) btn.click();
            });
        }
        const nextToExpenses = document.getElementById('az-btn-next-expenses');
        if (nextToExpenses) {
            nextToExpenses.addEventListener('click', () => {
                const btn = document.querySelector('[data-az-step="expenses"]');
                if (btn) btn.click();
            });
        }

        // Toggle Buttons (Single / Joint)
        const btnSingle = document.getElementById('az-btn-single');
        const btnJoint = document.getElementById('az-btn-joint');
        const jointIncomeGroup = document.getElementById('az-joint-income-group');

        if (btnSingle && btnJoint) {
            btnSingle.addEventListener('click', () => {
                state.borrowing.applicantType = 'single';
                btnSingle.classList.add('active');
                btnJoint.classList.remove('active');
                if (jointIncomeGroup) jointIncomeGroup.style.display = 'none';
                updateBorrowingCapacity();
            });
            btnJoint.addEventListener('click', () => {
                state.borrowing.applicantType = 'joint';
                btnJoint.classList.add('active');
                btnSingle.classList.remove('active');
                if (jointIncomeGroup) jointIncomeGroup.style.display = 'block';
                updateBorrowingCapacity();
            });
        }

        // Toggle Buttons (Residence / Investment)
        const btnResidence = document.getElementById('az-btn-residence');
        const btnInvestment = document.getElementById('az-btn-investment');
        if (btnResidence && btnInvestment) {
            btnResidence.addEventListener('click', () => {
                state.borrowing.purpose = 'owner';
                btnResidence.classList.add('active');
                btnInvestment.classList.remove('active');
                updateBorrowingCapacity();
            });
            btnInvestment.addEventListener('click', () => {
                state.borrowing.purpose = 'investment';
                btnInvestment.classList.add('active');
                btnResidence.classList.remove('active');
                updateBorrowingCapacity();
            });
        }

        // Dependants stepper
        const depDec = document.getElementById('az-dep-dec');
        const depInc = document.getElementById('az-dep-inc');
        const depVal = document.getElementById('az-dep-val');
        if (depDec && depInc && depVal) {
            depDec.addEventListener('click', () => {
                state.borrowing.dependants = Math.max(0, state.borrowing.dependants - 1);
                depVal.value = state.borrowing.dependants;
                updateBorrowingCapacity();
            });
            depInc.addEventListener('click', () => {
                state.borrowing.dependants = Math.min(10, state.borrowing.dependants + 1);
                depVal.value = state.borrowing.dependants;
                updateBorrowingCapacity();
            });
        }

        // Income Inputs
        const inIncome1 = document.getElementById('az-in-income1');
        const inIncome2 = document.getElementById('az-in-income2');
        const inRental = document.getElementById('az-in-rental');
        const inOtherIncome = document.getElementById('az-in-other-income');

        [inIncome1, inIncome2, inRental, inOtherIncome].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    state.borrowing.income1 = uncomma(inIncome1.value);
                    if (inIncome2) state.borrowing.income2 = uncomma(inIncome2.value);
                    if (inRental) state.borrowing.rentalIncome = uncomma(inRental.value);
                    if (inOtherIncome) state.borrowing.otherIncome = uncomma(inOtherIncome.value);
                    updateBorrowingCapacity();
                });
            }
        });

        // Expenses Inputs
        const inLiving = document.getElementById('az-in-living');
        const inCards = document.getElementById('az-in-cards');
        const inOtherLoans = document.getElementById('az-in-other-loans');

        [inLiving, inCards, inOtherLoans].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    if (inLiving) state.borrowing.livingExpenses = uncomma(inLiving.value);
                    if (inCards) state.borrowing.creditCardLimit = uncomma(inCards.value);
                    if (inOtherLoans) state.borrowing.otherLoans = uncomma(inOtherLoans.value);
                    updateBorrowingCapacity();
                });
            }
        });

        // Loan Preferences (P&I vs IO toggle)
        const togglePI = document.getElementById('az-toggle-pi-io');
        if (togglePI) {
            togglePI.addEventListener('change', () => {
                state.borrowing.repaymentType = togglePI.checked ? 'io' : 'pi';
                updateBorrowingCapacity();
            });
        }

        // Frequency select
        const selFreq = document.getElementById('az-sel-freq');
        if (selFreq) {
            selFreq.addEventListener('change', () => {
                state.borrowing.frequency = selFreq.value;
                updateBorrowingCapacity();
            });
        }

        // Term input
        const inTerm = document.getElementById('az-in-term');
        if (inTerm) {
            inTerm.addEventListener('input', () => {
                state.borrowing.termYears = parseInt(inTerm.value, 10) || 30;
                updateBorrowingCapacity();
            });
        }

        // Rate input
        const inRate = document.getElementById('az-in-rate');
        if (inRate) {
            inRate.addEventListener('input', () => {
                state.borrowing.interestRate = parseFloat(inRate.value) || 5.93;
                updateBorrowingCapacity();
            });
        }

        // Adjusted Borrowing Slider inside Result Card
        const adjustSlider = document.getElementById('az-borrow-adjust-slider');
        if (adjustSlider) {
            adjustSlider.addEventListener('input', () => {
                state.borrowing.adjustedBorrowing = parseFloat(adjustSlider.value);
                updateBorrowingCapacity();
            });
        }

        // ----------------------------------------------------
        // Tab 2: Loan Repayments Handlers
        // ----------------------------------------------------
        const rLoanAmt = document.getElementById('az-r-amount');
        const rLoanAmtSlider = document.getElementById('az-r-amount-slider');
        const rTerm = document.getElementById('az-r-term');
        const rTermSlider = document.getElementById('az-r-term-slider');
        const rRate = document.getElementById('az-r-rate');
        const rRateSlider = document.getElementById('az-r-rate-slider');
        const rTogglePI = document.getElementById('az-r-toggle-pi-io');
        const rFreq = document.getElementById('az-r-freq');

        if (rLoanAmt && rLoanAmtSlider) {
            rLoanAmt.addEventListener('input', () => {
                state.repayment.loanAmount = uncomma(rLoanAmt.value);
                rLoanAmtSlider.value = state.repayment.loanAmount;
                updateLoanRepayments();
            });
            rLoanAmtSlider.addEventListener('input', () => {
                state.repayment.loanAmount = parseFloat(rLoanAmtSlider.value);
                rLoanAmt.value = fmt(state.repayment.loanAmount);
                updateLoanRepayments();
            });
        }

        if (rTerm && rTermSlider) {
            rTerm.addEventListener('input', () => {
                state.repayment.termYears = parseInt(rTerm.value, 10) || 30;
                rTermSlider.value = state.repayment.termYears;
                updateLoanRepayments();
            });
            rTermSlider.addEventListener('input', () => {
                state.repayment.termYears = parseInt(rTermSlider.value, 10);
                rTerm.value = state.repayment.termYears;
                updateLoanRepayments();
            });
        }

        if (rRate && rRateSlider) {
            rRate.addEventListener('input', () => {
                state.repayment.interestRate = parseFloat(rRate.value) || 5.99;
                rRateSlider.value = state.repayment.interestRate;
                updateLoanRepayments();
            });
            rRateSlider.addEventListener('input', () => {
                state.repayment.interestRate = parseFloat(rRateSlider.value);
                rRate.value = state.repayment.interestRate.toFixed(2);
                updateLoanRepayments();
            });
        }

        if (rTogglePI) {
            rTogglePI.addEventListener('change', () => {
                state.repayment.repaymentType = rTogglePI.checked ? 'io' : 'pi';
                updateLoanRepayments();
            });
        }

        if (rFreq) {
            rFreq.addEventListener('change', () => {
                state.repayment.frequency = rFreq.value;
                updateLoanRepayments();
            });
        }

        // ----------------------------------------------------
        // Tab 3: Refinance Handlers
        // ----------------------------------------------------
        const refBal = document.getElementById('az-ref-bal');
        const refYears = document.getElementById('az-ref-years');
        const refRate = document.getElementById('az-ref-rate');
        const refExtra = document.getElementById('az-ref-extra');
        const refLump = document.getElementById('az-ref-lump');

        [refBal, refYears, refRate, refExtra, refLump].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    if (refBal) state.refinance.currentBalance = uncomma(refBal.value);
                    if (refYears) state.refinance.remainingYears = parseInt(refYears.value, 10) || 25;
                    if (refRate) state.refinance.interestRate = parseFloat(refRate.value) || 6.24;
                    if (refExtra) state.refinance.extraMonthly = uncomma(refExtra.value);
                    if (refLump) state.refinance.lumpSum = uncomma(refLump.value);
                    updateRefinanceSavings();
                });
            }
        });

        // ----------------------------------------------------
        // Tab 4: Stamp Duty Handlers
        // ----------------------------------------------------
        const sdState = document.getElementById('az-sd-state');
        const sdPrice = document.getElementById('az-sd-price');
        const sdPriceSlider = document.getElementById('az-sd-price-slider');
        const sdBuyerFhb = document.getElementById('az-sd-buyer-fhb');
        const sdBuyerOwner = document.getElementById('az-sd-buyer-owner');
        const sdBuyerInvest = document.getElementById('az-sd-buyer-invest');

        if (sdState) {
            sdState.addEventListener('change', () => {
                state.stampDuty.state = sdState.value;
                updateStampDuty();
            });
        }

        if (sdPrice && sdPriceSlider) {
            sdPrice.addEventListener('input', () => {
                state.stampDuty.price = uncomma(sdPrice.value);
                sdPriceSlider.value = state.stampDuty.price;
                updateStampDuty();
            });
            sdPriceSlider.addEventListener('input', () => {
                state.stampDuty.price = parseFloat(sdPriceSlider.value);
                sdPrice.value = fmt(state.stampDuty.price);
                updateStampDuty();
            });
        }

        if (sdBuyerFhb && sdBuyerOwner && sdBuyerInvest) {
            sdBuyerFhb.addEventListener('click', () => {
                state.stampDuty.buyerType = 'first_home';
                sdBuyerFhb.classList.add('active');
                sdBuyerOwner.classList.remove('active');
                sdBuyerInvest.classList.remove('active');
                updateStampDuty();
            });
            sdBuyerOwner.addEventListener('click', () => {
                state.stampDuty.buyerType = 'owner';
                sdBuyerOwner.classList.add('active');
                sdBuyerFhb.classList.remove('active');
                sdBuyerInvest.classList.remove('active');
                updateStampDuty();
            });
            sdBuyerInvest.addEventListener('click', () => {
                state.stampDuty.buyerType = 'investor';
                sdBuyerInvest.classList.add('active');
                sdBuyerFhb.classList.remove('active');
                sdBuyerOwner.classList.remove('active');
                updateStampDuty();
            });
        }

        // ----------------------------------------------------
        // Tab 5: Purchasing Power Handlers
        // ----------------------------------------------------
        const savTarget = document.getElementById('az-sav-target');
        const savDeposit = document.getElementById('az-sav-deposit');
        const savMonthly = document.getElementById('az-sav-monthly');

        [savTarget, savDeposit, savMonthly].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    if (savTarget) state.savings.targetPrice = uncomma(savTarget.value);
                    if (savDeposit) state.savings.currentDeposit = uncomma(savDeposit.value);
                    if (savMonthly) state.savings.monthlySavings = uncomma(savMonthly.value);
                    updatePurchasingPower();
                });
            }
        });

        // ----------------------------------------------------
        // Modals & Action Buttons
        // ----------------------------------------------------
        // Suggested Lenders modal
        const btnLenders = document.getElementById('az-btn-suggested-lenders');
        const lendersModal = document.getElementById('az-lenders-modal');
        const lendersClose = document.getElementById('az-lenders-close');

        if (btnLenders && lendersModal) {
            btnLenders.addEventListener('click', () => {
                lendersModal.classList.add('active');
            });
        }
        if (lendersClose && lendersModal) {
            lendersClose.addEventListener('click', () => {
                lendersModal.classList.remove('active');
            });
        }
        if (lendersModal) {
            lendersModal.addEventListener('click', (e) => {
                if (e.target === lendersModal) lendersModal.classList.remove('active');
            });
        }

        // Assumptions & Disclaimer modal
        const btnDisc = document.getElementById('az-btn-disclaimer');
        const discModal = document.getElementById('az-disc-modal');
        const discClose = document.getElementById('az-disc-close');

        if (btnDisc && discModal) {
            btnDisc.addEventListener('click', () => {
                discModal.classList.add('active');
            });
        }
        if (discClose && discModal) {
            discClose.addEventListener('click', () => {
                discModal.classList.remove('active');
            });
        }
        if (discModal) {
            discModal.addEventListener('click', (e) => {
                if (e.target === discModal) discModal.classList.remove('active');
            });
        }

        // Save Results Button
        const saveBtns = document.querySelectorAll('.az-calc-save-btn');
        saveBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                let msg = '';
                if (state.activeTab === 'borrowing') {
                    msg = `Borrowing Capacity Estimate: ${fmtCurr(state.borrowing.maxBorrowing)} at ${state.borrowing.interestRate}% p.a.`;
                } else if (state.activeTab === 'repayment') {
                    msg = `Loan Repayment on ${fmtCurr(state.repayment.loanAmount)}: ${fmtCurr(calcMonthlyPayment(state.repayment.loanAmount, state.repayment.interestRate, state.repayment.termYears))}/mo`;
                } else {
                    msg = `State Home Loan Centre Calculation saved successfully.`;
                }

                if (navigator.clipboard) {
                    navigator.clipboard.writeText(msg).then(() => {
                        alert(msg + '\n\nCopied to clipboard! Share this directly with Ashwani Pande during your review.');
                    }).catch(() => {
                        alert(msg + '\n\nSaved! Ashwani Pande can review your numbers.');
                    });
                } else {
                    alert(msg + '\n\nSaved!');
                }
            });
        });

        // Initial calculations
        updateBorrowingCapacity();
        updateLoanRepayments();
        updateRefinanceSavings();
        updateStampDuty();
        updatePurchasingPower();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCalculator);
    } else {
        initCalculator();
    }
})();
