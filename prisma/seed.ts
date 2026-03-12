const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const seedPrisma = new PrismaClient();

async function main() {
  // 1. Create Categories
  const categories = [
    { name: "Wealth Building", slug: "wealth-building" },
    { name: "Passive Income", slug: "passive-income" },
    { name: "AI Tools", slug: "ai-tools" },
    { name: "Real Estate", slug: "real-estate" },
    { name: "Stock Market", slug: "stock-market" },
    { name: "Psychology", slug: "psychology" },
  ];

  for (const cat of categories) {
    await seedPrisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("Categories seeded");

  // 2. Create an Admin User with a password
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await seedPrisma.user.upsert({
    where: { email: "admin@bloggerpro.com" },
    update: {
      password: hashedPassword,
    },
    create: {
      email: "admin@bloggerpro.com",
      name: "BloggerPro Admin",
      role: "ADMIN",
      password: hashedPassword,
    },
  });

  // 3. Create initial Posts
  const wealthCat = await seedPrisma.category.findUnique({ where: { slug: "wealth-building" } });
  const passiveCat = await seedPrisma.category.findUnique({ where: { slug: "passive-income" } });

  const posts = [
    {
      title: "How We Saved $47,000 in 12 Months Using These 3 Simple Automation Rules",
      slug: "save-47k-automation-rules",
      excerpt: "Wealth building isn't about how much you earn, but how much you keep. We explore the automated systems used by top savers.",
      content: "Wealth building isn't about how much you earn... [Full Content to be updated via CMS]",
      isPremium: true,
      readTime: "8 min read",
      authorId: admin.id,
      categoryId: wealthCat.id,
      published: true,
    },
    {
      title: "5 Passive Income Side Hustles Generating $5,000/Month in 2026",
      slug: "passive-income-side-hustles-2026",
      excerpt: "From digital assets to automated rental properties, here are the most effective ways to build recurring revenue this year.",
      content: "Digital assets are the new oil... [Full Content to be updated via CMS]",
      isPremium: false,
      readTime: "12 min read",
      authorId: admin.id,
      categoryId: passiveCat.id,
      published: true,
    },
    {
      title: "The AI Wealth Blueprint: How to Leverage GPT-4 for Financial Analysis",
      slug: "ai-wealth-blueprint-gpt4",
      excerpt: "Stop guessing. Start using AI to analyze market trends and automate your personal budget with 99% accuracy.",
      content: "AI is changing the game... [Full Content to be updated via CMS]",
      isPremium: true,
      readTime: "10 min read",
      authorId: admin.id,
      categoryId: (await seedPrisma.category.findUnique({ where: { slug: "ai-tools" } })).id,
      published: true,
    },
    {
      title: "Why Real Estate Is Still the #1 Wealth Creator for the Top 1%",
      slug: "real-estate-wealth-creator",
      excerpt: "Everything you need to know about starting your real estate portfolio with less than $10,000.",
      content: "Real estate has created more millionaires... [Full Content to be updated via CMS]",
      isPremium: false,
      readTime: "15 min read",
      authorId: admin.id,
      categoryId: (await seedPrisma.category.findUnique({ where: { slug: "real-estate" } })).id,
      published: true,
    },
    {
      title: "Stock Market Mastery: Navigating Volatility in a Post-AI World",
      slug: "stock-market-mastery-post-ai",
      excerpt: "Professional strategies for identifying undervalued growth stocks before they hit the headlines.",
      content: "The stock market is evolving... [Full Content to be updated via CMS]",
      isPremium: true,
      readTime: "7 min read",
      authorId: admin.id,
      categoryId: (await seedPrisma.category.findUnique({ where: { slug: "stock-market" } })).id,
      published: true,
    },
    {
      title: "The Psychology of Money: Why Your Mind Is Your Biggest Asset",
      slug: "psychology-of-money-asset",
      excerpt: "Mastering your financial mindset is the first step toward true wealth. Here's how to rewire your brain for success.",
      content: "Most people fail financially... [Full Content to be updated via CMS]",
      isPremium: false,
      readTime: "5 min read",
      authorId: admin.id,
      categoryId: wealthCat.id,
      published: true,
    },
  ];

  for (const post of posts) {
    await seedPrisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log("Posts seeded");

  // 4. Create Static Pages (CMS content)
  const staticPages = [
    {
      title: "About BLOGGERPRO",
      slug: "about",
      content: `
        <h2>Our Mission</h2>
        <p>BloggerPro was founded to bridge the gap between financial theory and real-world wealth building. We provide the tools, strategies, and community support needed to achieve true financial independence.</p>
        <h2>The Top 1% Strategy</h2>
        <p>We focus on non-traditional wealth creators: AI automation, niche real estate, and digital assets. Our contributors are battle-tested experts in their respective fields.</p>
      `,
      published: true,
    },
    {
      title: "Financial Disclaimer",
      slug: "disclaimer",
      content: `
        <p>The information provided on BLOGGERPRO is for educational and informational purposes only. We are not financial advisors, and the content should not be construed as professional financial advice.</p>
        <p>Investing involves risk. Always perform your own due diligence or consult with a qualified professional before making significant financial decisions.</p>
      `,
      published: true,
    },
    {
      title: "Privacy Policy",
      slug: "privacy-policy",
      content: `
        <h2>Data Collection</h2>
        <p>At BloggerPro, we respect your privacy. We collect minimal data required for account management and session security.</p>
        <h2>Cookie Usage</h2>
        <p>We use essential cookies to maintain your login session and preferences. We do not sell your personal information to third parties.</p>
      `,
      published: true,
    },
    {
      title: "Terms of Service",
      slug: "terms",
      content: `
        <h2>User Conduct</h2>
        <p>By using BloggerPro, you agree to follow our community rules. Harassment, spam, and financial scams are strictly prohibited.</p>
        <h2>Content Ownership</h2>
        <p>Users retain ownership of their contributions, but grant BloggerPro a license to display that content on the platform.</p>
      `,
      published: true,
    }
  ];

  for (const page of staticPages) {
    await seedPrisma.staticPage.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }

  console.log("Static pages seeded");

  // 5. Create Site Settings (Singleton)
  await seedPrisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteName: "BloggerPro",
      siteDescription: "The ultimate platform for modern wealth building and AI-driven growth.",
      contactEmail: "admin@bloggerpro.com",
      primaryColor: "#10b981",
      chatbotName: "ProBot",
      chatbotWelcome: "Welcome to the future of wealth. How can I help you today?",
    }
  });
  console.log("Site settings seeded");

  // 6. Create Community Rules
  const rules = [
    { title: "Value First", content: "Always aim to provide value or insight in your posts. Avoid low-effort spam.", order: 1 },
    { title: "No Financial Advice", content: "We are an educational platform. Never provide or solicit regulated financial advice.", order: 2 },
    { title: "Respect the Grind", content: "Be respectful to other members. Personal attacks are strictly prohibited.", order: 3 },
  ];

  for (const rule of rules) {
    await seedPrisma.communityRule.create({ data: rule });
  }
  console.log("Community rules seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await seedPrisma.$disconnect();
  });
