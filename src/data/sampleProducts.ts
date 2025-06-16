
export const sampleProducts = [
  {
    id: "1",
    title: "AI that actually matches resumes to jobs that make sense",
    tagline: "Cutting through recruitment noise with intelligent job-candidate matching",
    description: "Job hunting is broken. You're either overqualified for everything or underqualified for your dream role, and the black hole of ATS systems means your perfect resume never reaches human eyes. Meanwhile, recruiters are drowning in 500 applications for every decent position, most of which are completely irrelevant. MatchMaker is an AI that cuts through the noise by understanding what jobs actually require vs. what they say they require, and what candidates can actually do vs. what their resume claims.",
    opportunityScore: 9,
    problemScore: 9,
    feasibilityScore: 6,
    whyNowScore: 9,
    searchVolume: {
      keyword: "AI recruitment",
      monthlyVolume: 14800,
      growthPercentage: 311,
      chartData: [
        { month: "2022", volume: 2100 },
        { month: "2023", volume: 5200 },
        { month: "2024", volume: 8900 },
        { month: "2025", volume: 14800 }
      ]
    },
    businessFit: {
      revenueScore: 9,
      executionScore: 6,
      marketScore: 9,
      founderScore: 8
    },
    communitySignals: [
      { platform: "Reddit", score: 8, members: "2.5M+ members", engagement: "7 subscribers" },
      { platform: "Facebook", score: 7, members: "150K+ members", engagement: "5 groups" },
      { platform: "YouTube", score: 7, members: "views", engagement: "12 channels" },
      { platform: "Other", score: 8, members: "4 priorities", engagement: "5 segments" }
    ],
    category: {
      type: "SaaS",
      market: "B2B",
      target: "Job Seekers",
      competitor: "LinkedIn"
    },
    offerings: [
      {
        tier: "LEAD MAGNET",
        name: "AI-Powered Resume Analysis",
        price: "Free",
        description: "Free tool providing resume analysis and job match suggestions."
      },
      {
        tier: "FRONTEND",
        name: "Job Market Trends Webinar",
        price: "$49 per session",
        description: "Live session on AI recruitment benefits and market trends."
      },
      {
        tier: "CORE",
        name: "Recruiter Subscription Program",
        price: "$500-$2,000/month",
        description: "Subscription for recruiters to access AI job matching and analytics tools."
      }
    ],
    marketAnalysis: "The AI recruitment market is rapidly growing, driven by advancements in AI technology and increasing demand for precision in hiring processes.",
    whyNowExplanation: "The AI recruitment market is set to explode, with projections reaching USD 1.56 billion by 2037 and a CAGR of over 7.4%, fueled by technological advances in AI and surging demand for precision matching. Now is the perfect time to launch the AI CV Matcher.",
    createdDate: "2024-01-15"
  },
  {
    id: "2", 
    title: "Smart Home Energy Optimization Platform",
    tagline: "AI-powered energy management that cuts your electricity bill in half",
    description: "Homeowners are struggling with skyrocketing energy costs while trying to reduce their carbon footprint. Current smart home solutions are fragmented and require expensive hardware installations. Our platform uses existing smart devices and AI algorithms to optimize energy consumption patterns, automatically adjusting heating, cooling, and device usage based on real-time energy prices, weather forecasts, and household behavior patterns.",
    opportunityScore: 8,
    problemScore: 8,
    feasibilityScore: 7,
    whyNowScore: 8,
    searchVolume: {
      keyword: "smart home energy",
      monthlyVolume: 22400,
      growthPercentage: 185,
      chartData: [
        { month: "2022", volume: 7800 },
        { month: "2023", volume: 12600 },
        { month: "2024", volume: 18900 },
        { month: "2025", volume: 22400 }
      ]
    },
    businessFit: {
      revenueScore: 8,
      executionScore: 7,
      marketScore: 8,
      founderScore: 7
    },
    communitySignals: [
      { platform: "Reddit", score: 9, members: "1.2M+ members", engagement: "r/homeautomation" },
      { platform: "Facebook", score: 6, members: "850K+ members", engagement: "Smart Home groups" },
      { platform: "YouTube", score: 8, members: "2M+ views/month", engagement: "Tech channels" },
      { platform: "Other", score: 7, members: "Forums & Discord", engagement: "Active communities" }
    ],
    category: {
      type: "SaaS + Hardware",
      market: "B2C",
      target: "Homeowners",
      competitor: "Nest, Ecobee"
    },
    offerings: [
      {
        tier: "LEAD MAGNET",
        name: "Home Energy Audit Tool",
        price: "Free",
        description: "Free energy consumption analysis and savings potential calculator."
      },
      {
        tier: "FRONTEND",
        name: "Smart Energy Starter Kit",
        price: "$99",
        description: "Basic monitoring setup with 30-day optimization trial."
      },
      {
        tier: "CORE",
        name: "Complete Energy Platform",
        price: "$29/month",
        description: "Full AI optimization platform with advanced analytics and automation."
      }
    ],
    marketAnalysis: "Smart home market growing at 25% CAGR, energy costs rising globally, increased focus on sustainability.",
    whyNowExplanation: "Perfect timing with rising energy costs, increased smart home adoption, and growing environmental consciousness. Government incentives for energy efficiency create additional tailwinds.",
    createdDate: "2024-02-20"
  },
  {
    id: "3",
    title: "Local Business Discovery & Review Platform",
    tagline: "Hyperlocal business discovery that actually helps you decide where to go",
    description: "Finding quality local businesses is broken. Google Reviews are manipulated, Yelp is pay-to-play, and social media recommendations get lost in the noise. Our platform combines AI-powered sentiment analysis of genuine customer feedback with real-time business data (wait times, availability, current promotions) to provide trustworthy, actionable recommendations for local restaurants, services, and experiences based on your specific needs and preferences.",
    opportunityScore: 7,
    problemScore: 8,
    feasibilityScore: 8,
    whyNowScore: 6,
    searchVolume: {
      keyword: "local business discovery",
      monthlyVolume: 9600,
      growthPercentage: 92,
      chartData: [
        { month: "2022", volume: 5000 },
        { month: "2023", volume: 6800 },
        { month: "2024", volume: 8400 },
        { month: "2025", volume: 9600 }
      ]
    },
    businessFit: {
      revenueScore: 6,
      executionScore: 8,
      marketScore: 7,
      founderScore: 6
    },
    communitySignals: [
      { platform: "Reddit", score: 7, members: "800K+ members", engagement: "r/LocalBusiness" },
      { platform: "Facebook", score: 8, members: "2M+ members", engagement: "Local groups" },
      { platform: "YouTube", score: 5, members: "Limited content", engagement: "Food/review channels" },
      { platform: "Other", score: 6, members: "Nextdoor, local forums", engagement: "Neighborhood apps" }
    ],
    category: {
      type: "Marketplace",
      market: "B2B2C",
      target: "Local Consumers",
      competitor: "Google, Yelp"
    },
    offerings: [
      {
        tier: "LEAD MAGNET",
        name: "Local Spot Finder",
        price: "Free",
        description: "Free local business recommendations with basic filtering."
      },
      {
        tier: "FRONTEND",
        name: "Premium Discovery",
        price: "$4.99/month",
        description: "Advanced filtering, real-time data, and personalized recommendations."
      },
      {
        tier: "CORE",
        name: "Business Analytics Suite",
        price: "$99/month",
        description: "For businesses: customer insights, reputation management, and promotion tools."
      }
    ],
    marketAnalysis: "Local search market valued at $50B+, growing need for authentic recommendations in post-pandemic world.",
    whyNowExplanation: "Post-COVID emphasis on supporting local businesses, increased skepticism of traditional review platforms, and need for real-time business information creates opportunity for disruption.",
    createdDate: "2024-03-10"
  },
  {
    id: "4",
    title: "Personal Finance AI Coach for Millennials",
    tagline: "AI-powered financial coach that adapts to your chaotic millennial lifestyle",
    description: "Traditional financial advice doesn't work for millennials dealing with gig economy income, student loans, high rent, and delayed life milestones. Generic budgeting apps fail because they don't understand the complexity of modern financial lives. Our AI coach learns your unique financial patterns, goals, and constraints to provide personalized, actionable advice that adapts as your life changes - whether you're freelancing, job-hopping, or trying to save for a house while paying off debt.",
    opportunityScore: 8,
    problemScore: 9,
    feasibilityScore: 7,
    whyNowScore: 7,
    searchVolume: {
      keyword: "millennial financial planning",
      monthlyVolume: 18200,
      growthPercentage: 156,
      chartData: [
        { month: "2022", volume: 7100 },
        { month: "2023", volume: 11400 },
        { month: "2024", volume: 15800 },
        { month: "2025", volume: 18200 }
      ]
    },
    businessFit: {
      revenueScore: 7,
      executionScore: 7,
      marketScore: 8,
      founderScore: 9
    },
    communitySignals: [
      { platform: "Reddit", score: 9, members: "1.8M+ members", engagement: "r/personalfinance" },
      { platform: "Facebook", score: 6, members: "500K+ members", engagement: "Finance groups" },
      { platform: "YouTube", score: 8, members: "10M+ views/month", engagement: "FinTok creators" },
      { platform: "Other", score: 8, members: "TikTok, Instagram", engagement: "Social finance content" }
    ],
    category: {
      type: "FinTech SaaS",
      market: "B2C",
      target: "Millennials",
      competitor: "Mint, YNAB"
    },
    offerings: [
      {
        tier: "LEAD MAGNET",
        name: "Millennial Money Health Check",
        price: "Free",
        description: "Free financial assessment with personalized improvement roadmap."
      },
      {
        tier: "FRONTEND",
        name: "30-Day Financial Reset",
        price: "$97",
        description: "Intensive coaching program to establish healthy financial habits."
      },
      {
        tier: "CORE",
        name: "AI Financial Coach Pro",
        price: "$19/month",
        description: "Ongoing AI coaching with goal tracking, automated insights, and community support."
      }
    ],
    marketAnalysis: "Personal finance app market growing 15% annually, millennials represent largest user segment with highest willingness to pay for financial guidance.",
    whyNowExplanation: "Economic uncertainty, inflation concerns, and delayed traditional milestones make millennials desperate for financial guidance that understands their unique challenges. AI advancement enables truly personalized advice at scale.",
    createdDate: "2024-01-28"
  }
];
