const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const commands = [
  // 1-10: Getting Started & Basics
  { command: "help", response: "I can help you with: Passive Income, Real Estate, Side Hustles, Stock Market, Guide Access, and Membership Benefits. Try typing any of those topics!" },
  { command: "hello", response: "Greetings! I am ProBot, your local guide to the BLOGGERPRO wealth ecosystem. How can I assist your financial journey today?" },
  { command: "hi", response: "Hello! Ready to build some wealth? Ask me about passive income or our premium guides." },
  { command: "who are you", response: "I am ProBot, a localized expert knowledge base designed to provide instant answers to your financial and platform-related questions." },
  { command: "what can you do", response: "I can provide insights on 100+ financial topics, guide you through our premium content, and help you maximize your BLOGGERPRO membership." },
  { command: "start here", response: "The best way to start is by checking our 'Latest Insights' on the home page or grabbing our 'Zero to Pro' wealth guide in the shop." },
  { command: "wealth building", response: "Wealth building is a marathon. Focus on three pillars: Increasing income, reducing expenses, and investing the difference in cash-flowing assets." },
  { command: "financial freedom", response: "Financial freedom is reached when your passive income exceeds your living expenses. Our platform is dedicated to helping you hit that crossover point." },
  { command: "bloggerpro", response: "BLOGGERPRO is the #1 community for wealth builders, providing expert analysis, automated tools, and premium networking." },
  { command: "membership", response: "We offer Free and Pro tiers. Pro members get full guide access, ad-free reading, and exclusive market reports. Check /pricing for details." },

  // 11-20: Passive Income
  { command: "passive income", response: "Passive income is money earned with minimal ongoing effort. Top methods include dividend stocks, rental properties, and digital products." },
  { command: "dividends", response: "Dividends are payments made by a corporation to its shareholders. Consistent dividend investing is a cornerstone of long-term wealth." },
  { command: "rental income", response: "Rental income comes from owning property and leasing it. It provides consistent cash flow and long-term appreciation." },
  { command: "digital products", response: "Selling e-books, courses, or software online is a high-margin way to build passive income. See our 'Creator Economy' guide." },
  { command: "affiliate marketing", response: "Promote products you love and earn a commission on ہر sale. A great way to monetize a blog or social presence." },
  { command: "index funds", response: "Index funds track a market index like the S&P 500. They are a low-cost, high-win-rate way for most people to invest." },
  { command: "reits", response: "Real Estate Investment Trusts allow you to invest in large-scale real estate portfolios without owning physical property." },
  { command: "staking", response: "In the crypto world, staking involves locking up assets to support a network and earning rewards in return. High risk, high potential." },
  { command: "p2p lending", response: "Lending money to individuals or small businesses through online services. Diversify your risk across many loans." },
  { command: "royalties", response: "Earn ongoing payments for the use of your intellectual property, like books, music, or patents." },

  // 21-30: Real Estate
  { command: "real estate", response: "Real estate is a powerful wealth builder due to leverage, tax benefits, and forced appreciation. Start with our 'Property Pro' guide." },
  { command: "house hacking", response: "Living in one unit of your multi-family property while renting out the others. A great way to live for free while building equity." },
  { command: "brrrr strategy", response: "Buy, Rehab, Rent, Refinance, Repeat. A method to build a massive rental portfolio with limited capital." },
  { command: "wholesaling", response: "Finding deeply discounted properties and selling the contract to another investor for a fee. Low capital, high effort." },
  { command: "commercial real estate", response: "Investing in office buildings, retail spaces, or warehouses. Usually higher barrier to entry but more stable cash flow." },
  { command: "flipping houses", response: "Buying distressed properties, renovating them quickly, and selling for a profit. Requires high market knowledge." },
  { command: "mortgages", response: "Using debt to buy property. Fixed-rate 30-year mortgages are a classic hedge against inflation." },
  { command: "fha loans", response: "Government-backed loans that allow for low down payments (3.5%). Ideal for first-time home buyers/house hackers." },
  { command: "property management", response: "Hiring a pro to handle tenants and maintenance. Necessary for truly 'passive' rental income." },
  { command: "1031 exchange", response: "A tax-deferred strategy allowing you to sell a property and reinvest the proceeds into a new property." },

  // 31-40: Side Hustles
  { command: "side hustle", response: "A way to earn extra money outside your 9-5. It can provide seed capital for your investments or become your main business." },
  { command: "freelancing", response: "Selling your skills—writing, design, coding—on platforms like Upwork or Toptal. Great for immediate income." },
  { command: "consulting", response: "Leverage your professional expertise to solve problems for other businesses. High per-hour rate." },
  { command: "dropshipping", response: "Selling products online without holding inventory. Focus on marketing and customer service while a supplier handles shipping." },
  { command: "print on demand", response: "Sell your designs on apparel and home goods. No upfront costs, as items are printed only when ordered." },
  { command: "uber side hustle", response: "Gig economy staples like driving or delivery can provide quick cash, but be mindful of car depreciation and taxes." },
  { command: "blogging", response: "Building an audience around a niche and monetizing through ads, affiliates, and products. Like what we do here at BLOGGERPRO!" },
  { command: "youtube channel", response: "Monetize video content through the AdSense partner program and sponsors. High barrier to entry, massive upside." },
  { command: "selling on etsy", response: "The best place for handmade or vintage goods. Focus on SEO and high-quality photography." },
  { command: "saas", response: "Software as a Service. Building a tool that people pay a monthly fee for. The holy grail of side hustles." },

  // 41-50: Stock Market
  { command: "stock market", response: "A marketplace for buying and selling shares of public companies. Long-term average returns are ~10% annually." },
  { command: "bull market", response: "A period where stock prices are rising or expected to rise. Characterized by optimism and high investor confidence." },
  { command: "bear market", response: "Prices are falling, usually defined as a 20% drop from recent highs. A time of pessimism, but often a great buying opportunity." },
  { command: "p/e ratio", response: "Price-to-Earnings. A valuation metric comparing a company's stock price to its earnings per share." },
  { command: "market cap", response: "The total value of a company's shares. Large-cap companies are usually more stable; small-caps have more growth potential." },
  { command: "etfs", response: "Exchange Traded Funds. Like mutual funds but traded on the stock exchange throughout the day. Usually lower fees." },
  { command: "options trading", response: "Contracts giving the right (but not obligation) to buy or sell a stock at a set price. High risk, advanced strategy." },
  { command: "dividend yield", response: "The annual dividend payment divided by the stock price. Look for sostenibile yields, not just high ones." },
  { command: "growth stocks", response: "Companies expected to grow at a rate significantly above the average for the market. Often don't pay dividends." },
  { command: "value stocks", response: "Stocks that appear to be trading for less than their intrinsic or book value. Classic Warren Buffett style." },

  // 51-60: Crypto & Web3
  { command: "bitcoin", response: "The first and largest cryptocurrency. Often viewed as 'digital gold' and a hedge against fiat currency devaluation." },
  { command: "ethereum", response: "A blockchain platform that allows for smart contracts and decentralized applications (dApps). The foundation of DeFi." },
  { command: "defi", response: "Decentralized Finance. Financial services (lending, borrowing) built on blockchain technology without traditional banks." },
  { command: "nfts", response: "Non-Fungible Tokens. Unique digital assets representing ownership of art, collectibles, or even real estate." },
  { command: "cold storage", response: "Keeping your crypto offline (on a hardware wallet) to protect it from hacks and exchange failures. Highly recommended." },
  { command: "blockchain", response: "A distributed ledger technology that enables secure, transparent, and tamper-proof record-keeping." },
  { command: "stablecoins", response: "Cryptocurrencies pegged to a stable asset like the US dollar. Used to exit volatile positions without exiting the crypto ecosystem." },
  { command: "gas fees", response: "The cost of performing a transaction on a blockchain network like Ethereum. Can vary wildly based on network traffic." },
  { command: "mining", response: "Using computer hardware to secure a network and earn new coins as a reward. Requires high electricity and specialized gear." },
  { command: "hashing", response: "In crypto, a process that converts an input into a fixed-size string of characters, ensuring data integrity." },

  // 61-70: Personal Finance
  { command: "budgeting", response: "Tracking your income and expenses. Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings/debt." },
  { command: "emergency fund", response: "3-6 months of expenses kept in a high-yield savings account for unplanned events. Your first financial priority." },
  { command: "credit score", response: "A number representing your creditworthiness. High scores lead to lower interest rates on loans and insurance." },
  { command: "high yield savings", response: "A savings account that pays significantly more interest than a standard one. Where your emergency fund belongs." },
  { command: "debt snowball", response: "Paying off debts from smallest balance to largest. Great for psychological momentum." },
  { command: "debt avalanche", response: "Paying off debts from highest interest rate to lowest. Mathematically superior for saving money on interest." },
  { command: "net worth", response: "Your total assets minus your total liabilities. The ultimate scorecard for your financial health." },
  { command: "inflation", response: "The rate at which the general level of prices is rising. Investing is necessary just to maintain your purchasing power." },
  { command: "compound interest", response: "Earning interest on your interest. Albert Einstein called it the eighth wonder of the world." },
  { command: "tax brackets", response: "The range of incomes taxed at a particular rate. Remember, we have a progressive tax system." },

  // 71-80: Tax & Retirement
  { command: "401k", response: "An employer-sponsored retirement plan. Always contribute enough to get the full employer match—it's 100% free money." },
  { command: "ira", response: "Individual Retirement Account. A tax-advantaged way to save for retirement outside of your employer." },
  { command: "roth ira", response: "Contributions are made with after-tax money, but all growth and withdrawals in retirement are tax-free. Powerful for young investors." },
  { command: "hsa", response: "Health Savings Account. The most tax-efficient account: tax-free contributions, growth, and withdrawals for medical expenses." },
  { command: "capital gains tax", response: "Tax on the profit from selling an asset like a stock or property. Long-term rates (held >1 year) are much lower." },
  { command: "4% rule", response: "A rule of thumb for retirement: if you withdraw 4% of your portfolio annually, adjusted for inflation, it should last 30 years." },
  { command: "financial advisor", response: "A professional who helps you manage your money. Look for a 'fiduciary' who is legally required to act in your best interest." },
  { command: "expense ratio", response: "The annual fee you pay for an investment like an ETF. Always double-check this; low fees are key to wealth." },
  { command: "dollar cost averaging", response: "Investing a fixed amount of money at regular intervals, regardless of the market price. Reduces the risk of bad timing." },
  { command: "f.i.r.e", response: "Financial Independence, Retire Early. A movement focused on extreme saving and investing to retire in your 30s or 40s." },

  // 81-90: Site Support & Navigation
  { command: "how to use", response: "Read the blog for free insights, check the shop for premium guides, and visit the community board to network with other pros." },
  { command: "pricing", response: "We have Free (limited insights) and Pro ($19/mo, full guide access). Check out /pricing for more details." },
  { command: "gopro", response: "Ready to accelerate your journey? Head to /pricing to join our Pro community and unlock every expert guide now." },
  { command: "guides", response: "Our guides cover everything from Real Estate to AI Side Hustles. Visit the /shop to browse the full collection." },
  { command: "newsletter", response: "Join 12k+ readers. Sign up on the home page or in your profile settings to get the 'Weekly Blueprint' every Monday." },
  { command: "community", response: "Ask questions and share tips on our member board. Visit /community to join the conversation." },
  { command: "profile", response: "Manage your account, view your reputation points, and update your settings at /profile." },
  { command: "settings", response: "Adjust your notifications and dark mode preferences at /settings." },
  { command: "contact", response: "Need specific help? Reach out to our team at support@bloggerpro.com or via the contact page." },
  { command: "points", response: "Reputation points are earned by contributing helpful comments and engaging with the community. High points unlock elite status!" },

  // 91-100: Advanced Wealth & Strategy
  { command: "estate planning", response: "Preparing for the distribution of your assets after death. Includes wills, trusts, and power of attorney." },
  { command: "will vs trust", response: "A will goes through probate; a trust is a private document that can bypass probate and provide more control." },
  { command: "tax loss harvesting", response: "Selling investments at a loss to offset capital gains and reduce your tax bill. A key strategy for high earners." },
  { command: "leveraged investing", response: "Using borrowed money (like a margin loan) to invest. High risk as it magnifies both gains and losses." },
  { command: "angel investing", response: "Investing in early-stage startups in exchange for equity. High risk, but one 'unicorn' can make a career." },
  { command: "venture capital", response: "A form of private equity that provides capital to companies exhibiting high growth potential." },
  { command: "automated income", response: "Using software and AI tools to handle business operations, creates truly passive income. See our 'AI Automation' guide." },
  { command: "wealth preservation", response: "Focuses on maintaining wealth you've already built, prioritizing risk management over high growth." },
  { command: "charitable giving", response: "Donating wealth to offset taxes and support causes you care about. See 'Donor Advised Funds'." },
  { command: "the crossover point", response: "The exact moment your passive income from investments exceeds your living expenses. The definition of Financial Freedom." },
];

async function seed() {
  console.log("Seeding ProBot commands...");
  
  try {
    // Clear existing to avoid unique constraint errors if re-run
    await prisma.botCommand.deleteMany({});
    
    for (const cmd of commands) {
      await prisma.botCommand.create({
        data: {
          command: cmd.command.toLowerCase(),
          response: cmd.response,
          active: true
        }
      });
    }
    
    console.log(`Successfully seeded ${commands.length} commands.`);
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
