import React from 'react';
// Nothing yet, blank page.
function ContributorsPage() {


                // Define the contributor data by year
                const contributorData = {
                2024: [
                { name: "Alexis Mcharo", url: "https://github.com/alexismcharo" },
                { name: "Aung Khant Kyaw", url: "https://github.com/Aung33270333" },
                { name: "Daniel Erik Hong", url: "https://github.com/dhon0010" },
                { name: "Domico Carlo Wibowo", url: "https://github.com/SetPizzaOnBroil30min" },
                { name: "Ethan Chuen", url: "https://github.com/echu0033" },
                { name: "Jeffrey Yan", url: "https://github.com/jeffreyyan4" },
                { name: "Kenan Baydar", url: "https://github.com/kbay0009" },
                { name: "Lachlan Williams", url: "https://github.com/LachlanWilliams" },
                { name: "Mohammad Zawari", url: "https://github.com/me-za" },
                { name: "Oneil Chiang", url: "https://github.com/oneil1625" },
                { name: "Rishi Bidani", url: "https://github.com/Rishi-Bidani" },
                { name: "Thejas Thekkekara Vinod", url: "https://github.com/Alucardigan" },
                { name: "Trevor Yao", url: "https://github.com/WofWaf" },
                { name: "Ying-Tsai Wang", url: "https://github.com/ying-tsai-wang" },
                { name: "Zhijun Chen", url: "https://github.com/ZCStephen" }
        ],
        2023: [
                { name: "Abigail Lithwick", url: "https://github.com/abigail-rose" },
                { name: "Ahmed Khadawardi", url: "https://github.com/ahes0001" },
                { name: "Alex Kanellis", url: "https://github.com/akanel15" },
                { name: "Baaset Moslih", url: "https://github.com/AbBaSaMo" },
                { name: "Cheryl Lau", url: "https://github.com/clau-0016" },
                { name: "Francis Anthony", url: "https://github.com/francisanthony17" },
                { name: "James Hunt", url: "https://github.com/jhun0012" },
                { name: "Jon Yip", url: "https://github.com/jon65" },
                { name: "Luke Bonso", url: "https://github.com/lbon0008" },
                { name: "Mariah McCleery", url: "https://github.com/MariahMcCleery" },
                { name: "Mark Mikhail", url: "https://github.com/Mark-Mikhail" },
                { name: "Matthew Finis", url: "https://github.com/mfin0008" },
                { name: "Nethara Athukorala", url: "https://github.com/nath0002" }
        ]
};

return (
    <div style={{ padding: '20px' }}>
        {Object.entries(contributorData).map(([year, contributors]) => (
            <div key={year}>
                <h2 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', fontSize: '24px', color: '#333', marginBottom: '10px' }}>
                    Contributors ({year})
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {contributors.map((contributor, index) => (
                        <a key={index} href={contributor.url} style={{ textDecoration: 'none', color: 'blue', fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>
                            {contributor.name}
                        </a>
                    ))}
                </div>
            </div>
        ))}
    </div>
);
}

export default ContributorsPage;
