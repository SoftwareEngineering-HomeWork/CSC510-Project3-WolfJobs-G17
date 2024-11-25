const { generateOTPEmailTemplate } = require('../utils/emailTemplates');
const mjml = require('mjml');

describe('Email Template Tests', () => {
  it('should generate valid HTML email template', () => {
    const firstName = 'John';
    const otp = '123456';
    
    const html = generateOTPEmailTemplate(firstName, otp);
    
    // Check if template contains required elements
    expect(html).toContain('John'); // firstName
    expect(html).toContain('123456'); // OTP
    expect(html).toContain('WolfJobs'); // Company name
    expect(html).toContain('expire in 10 mins'); // Expiry message
  });

  it('should handle special characters in firstName', () => {
    const firstName = 'John & Mary <script>';
    const otp = '123456';
    
    const html = generateOTPEmailTemplate(firstName, otp);
    
    // Check if special characters are escaped
    expect(html).not.toContain('<script>');
    expect(html).toContain('&amp;'); // & should be escaped
  });

  it('should generate fallback template on error', () => {
    // Mock mjml to throw error
    jest.spyOn(mjml, 'default').mockImplementation(() => {
      throw new Error('MJML error');
    });

    const firstName = 'John';
    const otp = '123456';
    
    const html = generateOTPEmailTemplate(firstName, otp);
    
    // Should return fallback template
    expect(html).toContain('Hello John');
    expect(html).toContain('123456');
    expect(html).not.toContain('mjml');
  });

  it('should maintain correct styling', () => {
    const firstName = 'John';
    const otp = '123456';
    
    const html = generateOTPEmailTemplate(firstName, otp);
    
    // Check for specific styling elements
    expect(html).toContain('background-color: #ccd3e0');
    expect(html).toContain('font-family: Ubuntu, Helvetica, Arial, sans-serif');
    expect(html).toContain('color: #ABCDEA');
  });
}); 