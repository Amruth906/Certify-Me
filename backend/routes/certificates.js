const express = require('express');
const puppeteer = require('puppeteer');
const Result = require('../models/Result');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate certificate PDF
router.get('/generate/:resultId', auth, async (req, res) => {
  try {
    const result = await Result.findOne({
      where: {
        id: req.params.resultId,
        userId: req.user.id,
      },
      include: [
        { model: User, attributes: ['username', 'email'] },
        { model: Quiz, attributes: ['title'] },
      ],
    });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    if (!result.passed) {
      return res.status(400).json({ message: 'Certificate can only be generated for passed quizzes' });
    }

    // Generate certificate HTML
    const certificateHTML = generateCertificateHTML(result);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(certificateHTML, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Certificate_${result.User.username}_${result.Quiz.title}.pdf"`);
    
    res.send(pdf);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating certificate' });
  }
});

// Generate certificate HTML template
function generateCertificateHTML(result) {
  const date = new Date(result.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Georgia', serif;
          margin: 0;
          padding: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .certificate {
          background: white;
          padding: 60px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 800px;
          width: 100%;
          border: 8px solid #3B82F6;
          position: relative;
        }
        .certificate::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
        }
        .header {
          color: #3B82F6;
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 3px;
        }
        .subtitle {
          font-size: 24px;
          color: #6B7280;
          margin-bottom: 40px;
        }
        .recipient {
          font-size: 36px;
          color: #1F2937;
          font-weight: bold;
          margin: 30px 0;
          text-decoration: underline;
          text-decoration-color: #3B82F6;
        }
        .achievement {
          font-size: 20px;
          color: #4B5563;
          margin: 30px 0;
          line-height: 1.6;
        }
        .quiz-title {
          font-size: 28px;
          color: #3B82F6;
          font-weight: bold;
          margin: 20px 0;
        }
        .score {
          font-size: 24px;
          color: #059669;
          font-weight: bold;
          margin: 20px 0;
        }
        .date {
          font-size: 16px;
          color: #6B7280;
          margin-top: 40px;
        }
        .signature {
          margin-top: 60px;
          border-top: 2px solid #E5E7EB;
          padding-top: 20px;
          font-size: 14px;
          color: #9CA3AF;
        }
        .certificate-id {
          position: absolute;
          bottom: 10px;
          right: 20px;
          font-size: 10px;
          color: #9CA3AF;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">Certificate of Achievement</div>
        <div class="subtitle">This is to certify that</div>
        <div class="recipient">${result.User.username}</div>
        <div class="achievement">has successfully completed the</div>
        <div class="quiz-title">${result.Quiz.title}</div>
        <div class="achievement">with a score of</div>
        <div class="score">${result.score}% (${result.correctAnswers}/${result.totalQuestions} correct)</div>
        <div class="date">Issued on ${date}</div>
        <div class="signature">
          <div>Micro-Certification Platform</div>
          <div>Digital Certificate Authority</div>
        </div>
        <div class="certificate-id">Certificate ID: ${result.id}</div>
      </div>
    </body>
    </html>
  `;
}

module.exports = router;