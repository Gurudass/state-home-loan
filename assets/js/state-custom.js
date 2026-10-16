/**
 * State Home Loan Centre - Custom Script
 * Interactive 60-Second Loan Review & Booking Modal
 * Barangaroo, Sydney NSW
 */

(function() {
    'use strict';

    const GOALS = [
        { id: 'buy', label: 'Buying a Home', sub: 'First home buyer, next home or upgrading in Sydney' },
        { id: 'refi', label: 'Refinancing Current Mortgage', sub: 'Rate review, lower repayments or cash out' },
        { id: 'invest', label: 'Investment Property Loan', sub: 'Portfolio expansion, equity release & wealth' },
        { id: 'smsf', label: 'SMSF Property Lending', sub: 'Self-managed super fund residential & commercial' },
        { id: 'commercial', label: 'Commercial & Business Finance', sub: 'Business loans, commercial mortgages & asset finance' },
        { id: 'plan', label: 'Strategic Goal Planning', sub: 'Not sure where to begin? Map your borrowing roadmap' }
    ];

    const TIMING = [
        { id: '30', label: 'Within 30 Days', sub: 'Ready to make an offer or actively inspecting' },
        { id: '90', label: '1 to 3 Months', sub: 'Planning purchase or waiting on pre-approval' },
        { id: '180', label: '3 to 6 Months', sub: 'Getting loan documents & savings lined up' },
        { id: 'explore', label: 'Just Exploring Options', sub: 'Want to know borrowing capacity & rates' }
    ];

    const AMOUNT = [
        { id: 'a1', label: 'Under $500,000' },
        { id: 'a2', label: '$500,000 to $1,000,000' },
        { id: 'a3', label: '$1,000,000 to $2,000,000' },
        { id: 'a4', label: 'Over $2,000,000' },
        { id: 'a5', label: 'Not sure yet' }
    ];

    const INCOME = [
        { id: 'i1', label: 'Salary or Wages (PAYG)' },
        { id: 'i2', label: 'Self-Employed / Business Owner' },
        { id: 'i3', label: 'A Mix of Both (PAYG + Business/Dividends)' },
        { id: 'i4', label: 'Investor / Retired / Other' }
    ];

    const STEPS = [
        { key: 'goal', title: 'What would you like help with today?', opts: GOALS },
        { key: 'timing', title: 'When are you hoping to act?', opts: TIMING },
        { key: 'amount', title: 'Roughly what loan or property amount is involved?', hint: 'A rough estimate is fine. We will calculate exact borrowing power.', opts: AMOUNT },
        { key: 'income', title: 'How is your primary income earned?', opts: INCOME }
    ];

    const TIMES = ['9:00 am', '10:30 am', '12:00 pm', '2:00 pm', '3:30 pm', '5:00 pm'];

    function getNextWeekdays() {
        const out = [];
        const d = new Date();
        while (out.length < 5) {
            d.setDate(d.getDate() + 1);
            const w = d.getDay();
            if (w > 0 && w < 6) {
                out.push(new Date(d));
            }
        }
        return out;
    }

    const fmtDay = d => d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
    const fmtLong = d => d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });
    const esc = s => String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const findLabel = (list, id) => (list.find(o => o.id === id) || {}).label || '';

    let state = {
        step: 0,
        goal: '',
        timing: '',
        amount: '',
        income: '',
        name: '',
        mobile: '',
        email: '',
        when: 'Morning',
        day: null,
        time: null,
        err: ''
    };

    function resetState(goalId) {
        state = {
            step: 0,
            goal: goalId || '',
            timing: '',
            amount: '',
            income: '',
            name: '',
            mobile: '',
            email: '',
            when: 'Morning',
            day: null,
            time: null,
            err: ''
        };
        if (goalId && GOALS.some(g => g.id === goalId)) {
            state.goal = goalId;
            state.step = 1;
        }
    }

    let dialogEl = null;

    function getDialog() {
        if (!dialogEl) {
            dialogEl = document.getElementById('quiz');
            if (!dialogEl) {
                dialogEl = document.createElement('dialog');
                dialogEl.id = 'quiz';
                dialogEl.className = 'shl-quiz';
                dialogEl.setAttribute('aria-label', 'Book a Free Review');
                document.body.appendChild(dialogEl);
            }
            bindDialogEvents();
        }
        return dialogEl;
    }

    function closeDialog() {
        const dlg = getDialog();
        if (dlg) {
            if (typeof dlg.close === 'function') {
                try { dlg.close(); } catch (err) {}
            }
            dlg.removeAttribute('open');
        }
    }
    window.closeSHLBooking = closeDialog;

    // Listen for Escape key to close popup modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            closeDialog();
        }
    });

    function renderModal() {
        const dlg = getDialog();
        const s = state.step;
        const totalSteps = 6;
        const progressPct = Math.min(100, Math.round(((s + 1) / totalSteps) * 100));

        let content = '';

        if (s < 4) {
            const current = STEPS[s];
            const optsHtml = current.opts.map(o => `
                <button type="button" class="opt" data-key="${current.key}" data-val="${o.id}" aria-pressed="${state[current.key] === o.id}">
                    <b>${esc(o.label)}</b>
                    ${o.sub ? `<small>${esc(o.sub)}</small>` : ''}
                </button>
            `).join('');

            content = `
                <div class="dlg-top">
                    <div class="progress" role="progressbar" aria-valuenow="${progressPct}" aria-valuemin="0" aria-valuemax="100">
                        <i style="width:${progressPct}%"></i>
                    </div>
                    <button class="x-close" type="button" data-close aria-label="Close modal" title="Close modal">&#10005;</button>
                </div>
                <div>
                    <span class="eyebrow">Step ${s + 1} of 5 · Free Strategy Review</span>
                    <h2>${esc(current.title)}</h2>
                    ${current.hint ? `<p class="hint">${esc(current.hint)}</p>` : ''}
                </div>
                <div class="opts">
                    ${optsHtml}
                </div>
                <div class="dlg-footer">
                    ${s > 0 ? `<button class="back" type="button" data-back>&larr; Back</button>` : '<span></span>'}
                    <span class="confidential">No credit check · 100% confidential</span>
                </div>
            `;
        } else if (s === 4) {
            content = `
                <div class="dlg-top">
                    <div class="progress" role="progressbar" aria-valuenow="${progressPct}" aria-valuemin="0" aria-valuemax="100">
                        <i style="width:${progressPct}%"></i>
                    </div>
                    <button class="x-close" type="button" data-close aria-label="Close modal" title="Close modal">&#10005;</button>
                </div>
                <div>
                    <span class="eyebrow">Step 5 of 5 · Final Step</span>
                    <h2>Where should our Barangaroo team reach you?</h2>
                    <p class="hint">So the right mortgage specialist can review 70+ lender options before we speak.</p>
                </div>
                <form id="shlContactForm" novalidate style="display:grid;gap:10px;">
                    <div class="fgrid">
                        <label class="f">First & Last Name*
                            <input type="text" id="shl_name" autocomplete="name" value="${esc(state.name)}" placeholder="e.g. John Smith" required>
                        </label>
                        <label class="f">Australian Mobile*
                            <input type="tel" id="shl_mobile" inputmode="tel" autocomplete="tel" value="${esc(state.mobile)}" placeholder="0412 345 678" required>
                        </label>
                    </div>
                    <div class="fgrid">
                        <label class="f">Email Address*
                            <input type="email" id="shl_email" autocomplete="email" value="${esc(state.email)}" placeholder="name@email.com.au" required>
                        </label>
                        <label class="f">Best Time for Call
                            <select id="shl_when">
                                <option value="Morning (9am - 12pm)" ${state.when.startsWith('Morning') ? 'selected' : ''}>Morning (9:00 am – 12:00 pm)</option>
                                <option value="Afternoon (12pm - 4pm)" ${state.when.startsWith('Afternoon') ? 'selected' : ''}>Afternoon (12:00 pm – 4:00 pm)</option>
                                <option value="Late Afternoon (4pm - 6:30pm)" ${state.when.startsWith('Late') ? 'selected' : ''}>Late Afternoon (4:00 pm – 6:30 pm)</option>
                            </select>
                        </label>
                    </div>
                    <label style="display:flex;gap:8px;align-items:flex-start;font-size:11.5px;color:#556d78;line-height:1.4;">
                        <input type="checkbox" id="shl_agree" checked required style="margin-top:2px;accent-color:#0b5961;width:15px;height:15px;flex-shrink:0;">
                        <span>I agree to be contacted by State Home Loan Centre under the Privacy Policy. We never share your details.</span>
                    </label>
                    ${state.err ? `<div class="err" role="alert">${esc(state.err)}</div>` : ''}
                    <button class="thm-btn shl-btn-gold" type="submit" style="padding:10px 18px;font-size:14px;border-radius:6px;height:40px;">View Appointment Times &rarr;</button>
                </form>
                <div class="dlg-footer">
                    <button class="back" type="button" data-back>&larr; Back</button>
                    <span class="confidential">100% Secure &amp; Confidential</span>
                </div>
            `;
        } else if (s === 5) {
            const weekdays = getNextWeekdays();
            const dayButtons = weekdays.map((d, idx) => `
                <button type="button" class="slot" data-day="${idx}" aria-pressed="${state.day === idx}">
                    ${esc(fmtDay(d))}
                </button>
            `).join('');

            const timeButtons = TIMES.map(t => `
                <button type="button" class="slot" data-time="${t}" aria-pressed="${state.time === t}">
                    ${esc(t)}
                </button>
            `).join('');

            content = `
                <div class="dlg-top">
                    <div class="progress" role="progressbar" aria-valuenow="92" aria-valuemin="0" aria-valuemax="100">
                        <i style="width:92%"></i>
                    </div>
                    <button class="x-close" type="button" data-close aria-label="Close modal" title="Close modal">&#10005;</button>
                </div>
                <div>
                    <span class="eyebrow">Priority Availability</span>
                    <h2>Thanks, ${esc(state.name)}. Choose your preferred review slot.</h2>
                    <p class="hint">In person at Barangaroo or via phone / video.</p>
                </div>
                <div class="sum">
                    <span class="sum-tag">${esc(findLabel(GOALS, state.goal))}</span>
                    <span class="sum-tag">${esc(findLabel(TIMING, state.timing))}</span>
                    <span class="sum-tag">${esc(findLabel(AMOUNT, state.amount))}</span>
                    <span class="sum-tag">${esc(findLabel(INCOME, state.income))}</span>
                </div>
                <div style="display:grid;gap:8px;">
                    <b style="font-size:12.5px;color:#0c2139;">1. Select Day</b>
                    <div class="days">${dayButtons}</div>
                    <b style="font-size:12.5px;color:#0c2139;margin-top:2px;">2. Select Time (Sydney Time)</b>
                    <div class="times">${timeButtons}</div>
                </div>
                <button class="thm-btn shl-btn-gold" type="button" id="shlConfirmBooking" style="padding:10px 18px;font-size:14px;border-radius:6px;height:40px;" ${state.day !== null && state.time ? '' : 'disabled style="opacity:0.5;cursor:not-allowed;"'}>
                    Confirm My Free 20-Min Review
                </button>
                <div class="dlg-footer">
                    <button class="back" type="button" data-back>&larr; Back</button>
                    <span class="confidential">No cost or obligation</span>
                </div>
            `;
        } else {
            const confirmedDay = getNextWeekdays()[state.day] || new Date();
            content = `
                <div class="dlg-top" style="justify-content:flex-end;">
                    <button class="x-close" type="button" data-close aria-label="Close modal" title="Close modal">&#10005;</button>
                </div>
                <div style="text-align:center;display:grid;place-items:center;gap:10px;padding-top:4px;">
                    <div class="tick">&#10003;</div>
                    <span class="eyebrow">Appointment Confirmed</span>
                    <h2>You're all booked, ${esc(state.name)}!</h2>
                    <div style="background:#f3f7f7;padding:12px 18px;border-radius:8px;border:1px solid #d4e4e5;max-width:440px;width:100%;">
                        <b style="color:#0b5961;font-size:15px;display:block;">${esc(fmtLong(confirmedDay))} at ${esc(state.time)}</b>
                        <span style="font-size:12px;color:#667d89;">(Sydney Australian Eastern Time)</span>
                    </div>
                    <p style="font-size:13px;color:#556d78;max-width:440px;line-height:1.45;margin:0;">
                        A confirmation has been sent to <strong>${esc(state.email)}</strong>. A senior lending specialist from our Barangaroo team will connect with you on <strong>${esc(state.mobile)}</strong>.
                    </p>
                    <div class="sum" style="justify-content:center;">
                        <span class="sum-tag">${esc(findLabel(GOALS, state.goal))}</span>
                        <span class="sum-tag">${esc(findLabel(AMOUNT, state.amount))}</span>
                    </div>
                    <div style="margin-top:8px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
                        <button class="thm-btn" type="button" data-close style="border-radius:6px;padding:9px 20px;font-size:13px;">Done</button>
                        <a href="news.html" class="thm-btn" style="background:#0b5961;border-radius:6px;padding:9px 20px;font-size:13px;">Browse Loan Guides</a>
                    </div>
                </div>
            `;
        }

        dlg.innerHTML = `<div class="dlg">${content}</div>`;
    }

    function bindDialogEvents() {
        const dlg = dialogEl;

        dlg.addEventListener('click', function(e) {
            if (e.target.closest('[data-close]')) {
                closeDialog();
                return;
            }

            // Click outside the modal content (backdrop click)
            const rect = dlg.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && e.clientX <= rect.left + rect.width
            );
            if (!isInDialog || e.target === dlg) {
                closeDialog();
                return;
            }

            const optBtn = e.target.closest('.opt');
            if (optBtn) {
                const key = optBtn.dataset.key;
                const val = optBtn.dataset.val;
                state[key] = val;
                state.step++;
                renderModal();
                dlg.scrollTop = 0;
                return;
            }

            if (e.target.closest('[data-back]')) {
                state.step = Math.max(0, state.step - 1);
                state.err = '';
                renderModal();
                dlg.scrollTop = 0;
                return;
            }

            const dayBtn = e.target.closest('[data-day]');
            if (dayBtn) {
                state.day = parseInt(dayBtn.dataset.day, 10);
                renderModal();
                return;
            }

            const timeBtn = e.target.closest('[data-time]');
            if (timeBtn) {
                state.time = timeBtn.dataset.time;
                renderModal();
                return;
            }

            if (e.target.closest('#shlConfirmBooking') && state.day !== null && state.time) {
                state.step = 6;
                renderModal();
                dlg.scrollTop = 0;
            }
        });

        dlg.addEventListener('submit', function(e) {
            if (e.target.id === 'shlContactForm') {
                e.preventDefault();
                const name = (document.getElementById('shl_name').value || '').trim();
                const mobileRaw = (document.getElementById('shl_mobile').value || '').trim();
                const email = (document.getElementById('shl_email').value || '').trim();
                const when = document.getElementById('shl_when').value;
                const agree = document.getElementById('shl_agree').checked;

                const mobileClean = mobileRaw.replace(/[\s()-]/g, '');

                state.name = name;
                state.mobile = mobileRaw;
                state.email = email;
                state.when = when;

                if (!name) {
                    state.err = 'Please enter your first and last name.';
                } else if (!/^(\+?61|0)4\d{8}$/.test(mobileClean)) {
                    state.err = 'Please enter a valid Australian mobile (e.g. 0412 345 678).';
                } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                    state.err = 'Please enter a valid email address.';
                } else if (!agree) {
                    state.err = 'Please accept the privacy terms to proceed.';
                } else {
                    state.err = '';
                    state.step = 5;
                    renderModal();
                    dlg.scrollTop = 0;
                    return;
                }
                renderModal();
            }
        });
    }

    window.openSHLBooking = function(goalId) {
        resetState(goalId);
        renderModal();
        const dlg = getDialog();
        if (!dlg.open) {
            if (typeof dlg.showModal === 'function') {
                dlg.showModal();
            } else {
                dlg.setAttribute('open', '');
            }
        }
    };

    // Global listener for all booking triggers
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('[data-book], .open-booking-modal, a[href="#book"], a[href="#appointment"]');
        if (btn) {
            e.preventDefault();
            const goal = btn.getAttribute('data-book') || '';
            window.openSHLBooking(goal);
        }
    });

    // Handle inline loan calculator on index page and loan-calculator page
    document.addEventListener('DOMContentLoaded', function() {
        const calcForm = document.getElementById('loan-calculator');
        if (calcForm && window.noUiSlider) {
            setTimeout(function() {
                try {
                    const monthRange = document.getElementById('range-slider-month');
                    const countRange = document.getElementById('range-slider-count');
                    if (monthRange && countRange && monthRange.noUiSlider && countRange.noUiSlider) {
                        monthRange.noUiSlider.destroy();
                        countRange.noUiSlider.destroy();

                        // Update label indicators
                        const topBoxes = calcForm.querySelectorAll('.input-box__top');
                        if (topBoxes.length >= 2) {
                            topBoxes[0].innerHTML = '<span>$150,000</span><span>$2,500,000+</span>';
                            topBoxes[1].innerHTML = '<span>5 Years</span><span>30 Years</span>';
                        }

                        noUiSlider.create(countRange, {
                            start: 750000,
                            step: 25000,
                            tooltips: [wNumb({ decimals: 0, prefix: '$', thousand: ',' })],
                            connect: [true, false],
                            range: { min: 150000, max: 2500000 }
                        });

                        noUiSlider.create(monthRange, {
                            start: 30,
                            step: 1,
                            tooltips: [wNumb({ decimals: 0, suffix: ' Yrs' })],
                            connect: [true, false],
                            range: { min: 5, max: 30 }
                        });

                        function updateMortgage() {
                            const principal = parseFloat(countRange.noUiSlider.get());
                            const years = parseFloat(monthRange.noUiSlider.get());
                            const annualRate = 5.99; // Competitive benchmark rate % p.a.
                            const monthlyRate = (annualRate / 100) / 12;
                            const totalMonths = years * 12;

                            const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
                            const totalRepay = monthlyPayment * totalMonths;

                            const mElem = document.getElementById('loan-month');
                            const pElem = document.getElementById('loan-monthly-pay');
                            const tElem = document.getElementById('loan-total');

                            if (mElem) mElem.innerHTML = years + ' Years (' + totalMonths + ' mos)';
                            if (pElem) pElem.innerHTML = Math.round(monthlyPayment).toLocaleString('en-AU');
                            if (tElem) tElem.innerHTML = Math.round(totalRepay).toLocaleString('en-AU');
                        }

                        countRange.noUiSlider.on('update', updateMortgage);
                        monthRange.noUiSlider.on('update', updateMortgage);
                        updateMortgage();
                    }
                } catch (e) {
                    console.log('Mortgage calculator init:', e);
                }
            }, 300);
        }
    });

})();
