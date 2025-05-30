// Vendor Dashboard Functions
function loadVendorData(vendor) {
    // Load loan requests
    const activeRequests = document.getElementById('active-requests');
    const loanHistory = document.getElementById('loan-history');
    const lenderMatches = document.getElementById('lender-matches');
    
    if (vendor.loans && vendor.loans.length > 0) {
        activeRequests.innerHTML = '';
        loanHistory.innerHTML = '';
        
        vendor.loans.forEach(loan => {
            const loanItem = document.createElement('div');
            loanItem.classList.add('loan-item');
            
            let statusClass = '';
            if (loan.status === 'pending') statusClass = 'status-pending';
            else if (loan.status === 'approved') statusClass = 'status-approved';
            else if (loan.status === 'rejected') statusClass = 'status-rejected';
            
            loanItem.innerHTML = `
                <h4>$${loan.amount} for ${loan.purpose}</h4>
                <div class="loan-meta">
                    <span>Term: ${loan.term} months</span>
                    <span class="loan-status ${statusClass}">${loan.status}</span>
                </div>
                <p>${loan.description || ''}</p>
            `;
            
            if (loan.status === 'pending' || loan.status === 'approved') {
                activeRequests.appendChild(loanItem.cloneNode(true));
            } else {
                loanHistory.appendChild(loanItem);
            }
            
            // Show lender matches for approved loans
            if (loan.status === 'approved' && loan.matchedLenders && loan.matchedLenders.length > 0) {
                lenderMatches.innerHTML = '';
                loan.matchedLenders.forEach(lender => {
                    const lenderMatch = document.createElement('div');
                    lenderMatch.classList.add('lender-match');
                    
                    lenderMatch.innerHTML = `
                        <div class="lender-info">
                            <div class="lender-avatar">${lender.name.charAt(0)}</div>
                            <div>
                                <h4>${lender.name}</h4>
                                <p>Invested: $${lender.amount}</p>
                            </div>
                        </div>
                        <button class="btn-message" data-lender="${lender.id}">
                            <i class="fas fa-comment"></i>
                        </button>
                    `;
                    
                    lenderMatches.appendChild(lenderMatch);
                });
            }
        });
    }
    
    // Handle new loan request form
    const loanRequestForm = document.getElementById('loanRequestForm');
    if (loanRequestForm) {
        loanRequestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const amount = document.getElementById('loan-amount').value;
            const purpose = document.getElementById('loan-purpose').value.trim();
            const term = document.getElementById('loan-term').value;
            
            if (!amount || !purpose || !term) {
                alert('Please fill in all fields');
                return;
            }
            
            const newLoan = {
                id: generateId(),
                amount,
                purpose,
                term,
                description: purpose,
                status: 'pending',
                date: new Date().toISOString()
            };
            
            // Add to vendor's loans
            vendor.loans = vendor.loans || [];
            vendor.loans.push(newLoan);
            
            // Update in localStorage
            let vendors = JSON.parse(localStorage.getItem('vendors')) || [];
            const vendorIndex = vendors.findIndex(v => v.id === vendor.id);
            if (vendorIndex !== -1) {
                vendors[vendorIndex] = vendor;
                localStorage.setItem('vendors', JSON.stringify(vendors));
                localStorage.setItem('currentUser', JSON.stringify(vendor));
            }
            
            // Add to all loans (for lenders to see)
            let allLoans = JSON.parse(localStorage.getItem('allLoans')) || [];
            allLoans.push({
                ...newLoan,
                vendorId: vendor.id,
                vendorName: vendor.businessName
            });
            localStorage.setItem('allLoans', JSON.stringify(allLoans));
            
            alert('Loan request submitted successfully!');
            loanRequestForm.reset();
            loadVendorData(vendor);
        });
    }
}

// Lender Dashboard Functions
function loadLenderData(lender) {
    // Load available vendor requests
    const vendorRequests = document.getElementById('vendor-requests');
    const lenderInvestments = document.getElementById('lender-investments');
    
    let allLoans = JSON.parse(localStorage.getItem('allLoans')) || [];
    let vendors = JSON.parse(localStorage.getItem('vendors')) || [];
    
    // Filter out loans that this lender has already invested in
    const investedLoanIds = lender.investments ? lender.investments.map(i => i.loanId) : [];
    const availableLoans = allLoans.filter(loan => 
        loan.status === 'pending' && !investedLoanIds.includes(loan.id)
    );
    
    if (availableLoans.length > 0) {
        vendorRequests.innerHTML = '';
        
        availableLoans.forEach(loan => {
            const vendor = vendors.find(v => v.id === loan.vendorId);
            const vendorName = vendor ? vendor.businessName : 'Unknown Vendor';
            
            const requestItem = document.createElement('div');
            requestItem.classList.add('vendor-request');
            
            requestItem.innerHTML = `
                <h4>$${loan.amount} Request</h4>
                <div class="request-meta">
                    <span>${vendorName}</span>
                    <span>Term: ${loan.term} months</span>
                </div>
                <p>${loan.purpose}</p>
                <div class="request-actions">
                    <button class="btn-accept" data-loan="${loan.id}">Accept</button>
                    <button class="btn-reject" data-loan="${loan.id}">Reject</button>
                </div>
            `;
            
            vendorRequests.appendChild(requestItem);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.btn-accept').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const loanId = e.target.getAttribute('data-loan');
                handleLoanAction(lender, loanId, 'accept');
            });
        });
        
        document.querySelectorAll('.btn-reject').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const loanId = e.target.getAttribute('data-loan');
                handleLoanAction(lender, loanId, 'reject');
            });
        });
    }
    
    // Load lender's investments
    if (lender.investments && lender.investments.length > 0) {
        lenderInvestments.innerHTML = '';
        
        let totalInvested = 0;
        let activeLoans = 0;
        
        lender.investments.forEach(investment => {
            const loan = allLoans.find(l => l.id === investment.loanId);
            if (loan) {
                totalInvested += parseInt(investment.amount);
                if (loan.status === 'approved') activeLoans++;
                
                const investmentItem = document.createElement('div');
                investmentItem.classList.add('investment-item');
                
                investmentItem.innerHTML = `
                    <h4>$${investment.amount} in ${loan.vendorName || 'Vendor'}</h4>
                    <div class="investment-meta">
                        <span>Term: ${loan.term} months</span>
                        <span>Rate: ${investment.rate}%</span>
                    </div>
                    <p>Status: ${loan.status}</p>
                `;
                
                lenderInvestments.appendChild(investmentItem);
            }
        });
        
        // Update stats
        document.getElementById('total-invested').textContent = totalInvested;
        document.getElementById('active-loans').textContent = activeLoans;
        document.getElementById('avg-return').textContent = lender.investments.length > 0 ? 
            (lender.investments.reduce((sum, inv) => sum + parseInt(inv.rate), 0) / lender.investments.length : 0;)
    }
}

function handleLoanAction(lender, loanId, action) {
    let allLoans = JSON.parse(localStorage.getItem('allLoans')) || [];
    let vendors = JSON.parse(localStorage.getItem('vendors')) || [];
    let lenders = JSON.parse(localStorage.getItem('lenders')) || [];
    
    const loanIndex = allLoans.findIndex(l => l.id === loanId);
    if (loanIndex === -1) return;
    
    const loan = allLoans[loanIndex];
    const vendorIndex = vendors.findIndex(v => v.id === loan.vendorId);
    
    if (action === 'accept') {
        // For demo, just accept a portion of the loan
        const amount = Math.min(loan.amount / 2, 5000); // Max $5000 for demo
        
        // Update loan
        loan.matchedLenders = loan.matchedLenders || [];
        loan.matchedLenders.push({
            id: lender.id,
            name: lender.name,
            amount: amount,
            date: new Date().toISOString()
        });
        
        // Check if loan is fully funded
        const totalFunded = loan.matchedLenders.reduce((sum, l) => sum + l.amount, 0);
        if (totalFunded >= loan.amount) {
            loan.status = 'approved';
        }
        
        // Add to lender's investments
        lender.investments = lender.investments || [];
        lender.investments.push({
            loanId: loan.id,
            amount: amount,
            rate: calculateInterestRate(loan.term), // Simple rate calculation for demo
            date: new Date().toISOString()
        });
        
        // Update vendor's loan status
        if (vendorIndex !== -1) {
            const vendorLoanIndex = vendors[vendorIndex].loans.findIndex(l => l.id === loanId);
            if (vendorLoanIndex !== -1) {
                vendors[vendorIndex].loans[vendorLoanIndex] = loan;
            }
        }
        
        // Update all data in localStorage
        allLoans[loanIndex] = loan;
        localStorage.setItem('allLoans', JSON.stringify(allLoans));
        
        const lenderIndex = lenders.findIndex(l => l.id === lender.id);
        if (lenderIndex !== -1) {
            lenders[lenderIndex] = lender;
            localStorage.setItem('lenders', JSON.stringify(lenders));
            localStorage.setItem('currentUser', JSON.stringify(lender));
        }
        
        if (vendorIndex !== -1) {
            localStorage.setItem('vendors', JSON.stringify(vendors));
        }
        
        alert(`You've successfully invested $${amount} in this loan request!`);
    } else {
        // For reject, just remove from available loans for this lender
        lender.rejectedLoans = lender.rejectedLoans || [];
        lender.rejectedLoans.push(loanId);
        
        const lenderIndex = lenders.findIndex(l => l.id === lender.id);
        if (lenderIndex !== -1) {
            lenders[lenderIndex] = lender;
            localStorage.setItem('lenders', JSON.stringify(lenders));
            localStorage.setItem('currentUser', JSON.stringify(lender));
        }
        
        alert('Loan request rejected.');
    }
    
    // Reload data
    loadLenderData(lender);
}

function calculateInterestRate(term) {
    // Simple calculation for demo
    if (term <= 6) return 8;
    if (term <= 12) return 10;
    return 12;
}

// Helper function
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}