# Lead Scoring Backend API

A sophisticated lead scoring system that combines rule-based scoring with AI-powered intent analysis using Google Gemini AI.

## Features

- Dual Scoring System: Rule-based scoring (50 points) + AI analysis (50 points)
- Real AI Integration: Uses Google Gemini AI for intelligent lead analysis
- CSV Upload Support: Bulk lead processing with file upload
- Comprehensive Scoring: Considers role, industry, data completeness, and AI insights
- Export Functionality: Download results as CSV

## Setup Steps

### 1. Prerequisites
- Node.js
- Google Gemini API key (free from [Google AI Studio](https://makersuite.google.com/app/apikey))

### 2. Installation

# Clone the repository
git clone ""https://github.com/tanvimandhan/Lead_backend.git""
cd lead_backend

# Install dependencies
npm install

### 3. Environment Configuration
Create a `.env` file in the root directory:

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=5000

### 5. Start the Server
npm start

The server will run on `http://localhost:5000`

## API Usage Examples with Postman

### 1. Create an Offer
**Endpoint**:POST http://localhost:5000/offer/

**Headers**:
Content-Type: application/json

**Body** (raw JSON):
{
  "name": "AI Outreach Automation",
  "value_props": ["24/7 outreach", "6x more meetings"],
  "ideal_use_cases": ["B2B SaaS mid-market"]
}

**Expected Response**:

{
  "message": "Offer saved",
  "offer": {
    "name": "AI Outreach Automation",
    "value_props": ["24/7 outreach", "6x more meetings"],
    "ideal_use_cases": ["B2B SaaS mid-market"]
  }
}
```

### 2. Upload Leads CSV
**Endpoint**:POST http://localhost:5000/api/leads/upload

**Body**: form-data
- Key: `file` (type: File)
- Value: Upload your CSV file

**CSV Format**:

name,role,company,industry,location,linkedin_bio
John Doe,Head of Sales,TechCorp,Technology,San Francisco,Growth-focused sales leader with 10+ years in B2B SaaS
Jane Smith,Marketing Manager,StartupXYZ,SaaS,New York,Digital marketing expert specializing in lead generation
Bob Johnson,CEO,InnovateLtd,B2B,Austin,Serial entrepreneur focused on scaling B2B companies


**Expected Response**:json
{
  "message": "Leads uploaded",
  "count": 3
}


### 3. Score Leads
**Endpoint**:POST http://localhost:5000/api/leads/score

**Body**: None required

**Expected Response**:
```json
{
  "message": "Scoring completed",
  "count": 3
}
```

### 4. Get Results
**Endpoint**:GET http://localhost:5000/api/leads/results

**Expected Response**:
```json
[
  {
    "name": "John Doe",
    "role": "Head of Sales",
    "company": "TechCorp",
    "industry": "Technology",
    "location": "San Francisco",
    "linkedin_bio": "Growth-focused sales leader with 10+ years in B2B SaaS",
    "intent": "High",
    "score": 85,
    "reasoning": "As Head of Sales at TechCorp with 10+ years B2B SaaS experience and growth focus, this lead shows high intent. The role aligns perfectly with AI outreach automation, and the San Francisco location suggests tech-forward mindset."
  },
  {
    "name": "Jane Smith",
    "role": "Marketing Manager",
    "company": "StartupXYZ",
    "industry": "SaaS",
    "location": "New York",
    "linkedin_bio": "Digital marketing expert specializing in lead generation",
    "intent": "Medium",
    "score": 70,
    "reasoning": "Marketing Manager role shows medium influence level. While SaaS industry aligns well with the offer, the role may have limited direct decision-making authority for sales tools."
  }
]
```

### 5. Export Results
**Endpoint**: GET http://localhost:5000/api/leads/results/export 

**Expected Response**: Downloads a CSV file with all scored leads

## LOGIC

### Rule-Based Scoring (Maximum 50 Points)

#### 1. Role Relevance (20 points)
- **Decision Maker (20 points)**: Head, Chief, Director, VP, President, CEO
- **Influencer (10 points)**: Manager, Lead, Senior
- **Individual Contributor (0 points)**: All other roles

#### 2. Industry Match (20 points)
- **Exact ICP Match (20 points)**: Lead industry exactly matches offer's ideal use case
- **Adjacent Industry (10 points)**: Related industries (SaaS, Tech, B2B)
- **No Match (0 points)**: Unrelated industries

#### 3. Data Completeness (10 points)
- **All Fields Present (10 points)**: name, role, company, industry, location, linkedin_bio
- **Missing Fields (0 points)**: Any required field missing

### AI-Powered Scoring (Maximum 50 Points)

#### AI Analysis Process
The system uses Google Gemini AI to analyze each lead and provide:

1. **Intent Classification**: High, Medium, or Low
2. **Intelligent Reasoning**: Contextual analysis considering all lead data
3. **Score Mapping**:
   - **High Intent**: 50 points
   - **Medium Intent**: 30 points
   - **Low Intent**: 10 points

#### AI Prompt Structure
```
Analyze this lead for sales intent and fit with the offer:

LEAD INFORMATION:
- Name: [lead.name]
- Role: [lead.role]
- Company: [lead.company]
- Industry: [lead.industry]
- Location: [lead.location]
- LinkedIn Bio: [lead.linkedin_bio]

OFFER DETAILS:
- Product: [offer.name]
- Value Props: [offer.value_props]
- Ideal Use Cases: [offer.ideal_use_cases]

Please classify the lead's intent as High, Medium, or Low and provide a 1-2 sentence explanation.

Consider:
1. Decision-making authority
2. Industry alignment with offer
3. Role relevance to the product
4. Company size and growth stage
5. Geographic location relevance

Respond in JSON format:
{
  "intent": "High|Medium|Low",
  "reasoning": "Your explanation here"
}
```

### Final Score Calculation
```
Final Score = Rule Score + AI Score
Maximum Possible Score = 100 points
```

##  Complete Workflow

1. **Create Offer** → Define your product/offer details
2. **Upload Leads** → Bulk upload leads via CSV
3. **Score Leads** → Run the dual scoring system
4. **Get Results** → Retrieve scored leads with AI reasoning
5. **Export Results** → Download results as CSV

##  API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/offer/` | Create a new offer |
| POST | `/api/leads/upload` | Upload leads CSV file |
| POST | `/api/leads/score` | Score uploaded leads |
| GET | `/api/leads/results` | Get scoring results |
| GET | `/api/leads/results/export` | Export results as CSV |
| GET | `/` | Health check |

##  Technical Details

### Dependencies
- **Express.js**: Web framework
- **Multer**: File upload handling
- **CSV-Parser**: CSV file processing
- **Google Generative AI**: AI integration
- **dotenv**: Environment variable management

### File Structure
```
src/
├── controllers/
│   ├── lead.controllers.js
│   └── offer.controllers.js
├── routes/
│   ├── lead.routes.js
│   └── offer.routes.js
├── services/
│   ├── ai.service.js
│   └── score.services.js
├── utils/
│   └── csvParser.js
└── server.js
```

##  Error Handling

The system includes comprehensive error handling:
- **Missing API Key**: Falls back to mock AI logic
- **Invalid CSV Format**: Returns validation errors
- **Missing Data**: Provides clear error messages
- **AI Service Failures**: Automatic fallback to rule-based scoring







