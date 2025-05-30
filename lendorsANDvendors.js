document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabType = this.getAttribute('data-tab');
            document.getElementById('searchType').value = tabType;
        });
    });
    
    // Search form submission
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch();
    });
    
    // Perform the search
    function performSearch() {
        const searchType = document.getElementById('searchType').value;
        const businessType = document.getElementById('businessType').value;
        const location = document.getElementById('location').value.trim().toLowerCase();
        
        // Get all vendors and lenders from localStorage
        const vendors = JSON.parse(localStorage.getItem('vendors')) || [];
        const lenders = JSON.parse(localStorage.getItem('lenders')) || [];
        
        let results = [];
        
        if (searchType === 'all' || searchType === 'vendors') {
            results = results.concat(
                vendors.filter(vendor => {
                    const typeMatch = businessType === 'all' || vendor.businessType.toLowerCase() === businessType.toLowerCase();
                    const locationMatch = !location || (vendor.location && vendor.location.toLowerCase().includes(location));
                    return typeMatch && locationMatch;
                })
            );
        }
        
        if (searchType === 'all' || searchType === 'lenders') {
            results = results.concat(
                lenders.filter(lender => {
                    const typeMatch = businessType === 'all' || lender.lenderType.toLowerCase() === businessType.toLowerCase();
                    const locationMatch = !location || (lender.location && lender.location.toLowerCase().includes(location));
                    return typeMatch && locationMatch;
                })
            );
        }
        
        displayResults(results);
    }
    
    // Display search results
    function displayResults(results) {
        const resultsContainer = document.getElementById('resultsContainer');
        const noResults = document.getElementById('noResults');
        const resultsSection = document.getElementById('resultsSection');
        
        resultsContainer.innerHTML = '';
        resultsSection.style.display = 'block';
        
        if (results.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        results.forEach(item => {
            const card = document.createElement('div');
            card.className = 'result-card';
            
            const type = item.type || 'vendor'; // Default to vendor if type not specified
            const typeLabel = type === 'vendor' ? 'Vendor' : 'Lender';
            const typeClass = type === 'vendor' ? 'vendor-badge' : 'lender-badge';
            
            card.innerHTML = `
                <h3>${item.businessName || item.name}</h3>
                <span class="type-badge ${typeClass}">${typeLabel}</span>
                <p><strong>Type:</strong> ${item.businessType || item.lenderType}</p>
                ${item.location ? `<p><strong>Location:</strong> ${item.location}</p>` : ''}
                ${item.email ? `<p><strong>Email:</strong> ${item.email}</p>` : ''}
                ${item.description ? `<p>${item.description}</p>` : ''}
            `;
            
            resultsContainer.appendChild(card);
        });
    }
    
    // Initialize with some sample data if none exists
    function initializeSampleData() {
        if (!localStorage.getItem('vendors') || !localStorage.getItem('lenders')) {
            const sampleVendors = [
                {
                    id: 'vendor-1',
                    type: 'vendor',
                    businessName: 'Gourmet Catering Co.',
                    email: 'catering@example.com',
                    businessType: 'catering',
                    location: 'New York, NY',
                    description: 'Premium catering services for all occasions'
                },
                {
                    id: 'vendor-2',
                    type: 'vendor',
                    businessName: 'Elegant Venues',
                    email: 'venues@example.com',
                    businessType: 'venue',
                    location: 'Los Angeles, CA',
                    description: 'Beautiful venues for weddings and events'
                }
            ];
            
            const sampleLenders = [
                {
                    id: 'lender-1',
                    type: 'lender',
                    name: 'Quick Business Loans',
                    email: 'loans@example.com',
                    lenderType: 'business',
                    location: 'Chicago, IL',
                    description: 'Fast approval for small business loans'
                },
                {
                    id: 'lender-2',
                    type: 'lender',
                    name: 'Home Mortgage Solutions',
                    email: 'mortgage@example.com',
                    lenderType: 'mortgage',
                    location: 'Houston, TX',
                    description: 'Competitive mortgage rates for home buyers'
                }
            ];
            
            localStorage.setItem('vendors', JSON.stringify(sampleVendors));
            localStorage.setItem('lenders', JSON.stringify(sampleLenders));
        }
    }
    
    initializeSampleData();
});