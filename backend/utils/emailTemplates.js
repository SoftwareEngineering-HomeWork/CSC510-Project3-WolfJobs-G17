const mjml = require('mjml');

const generateOTPEmailTemplate = (firstName, otp) => {
  try {
    // Use a direct, publicly accessible URL for the image
    const imageUrl = "https://i.ibb.co/D4h3FBS/wolfjobs.jpg"; // Replace with your actual hosted image URL

    const mjmlTemplate = `
    <mjml>
      <mj-head>
        <mj-attributes>
          <mj-all font-family="Ubuntu, Helvetica, Arial, sans-serif" />
        </mj-attributes>
      </mj-head>
      <mj-body background-color="#ccd3e0">
        <mj-wrapper padding="0">
          <mj-section background-color="#fff" padding="20px 0">
            <mj-column>
              <mj-image src="${imageUrl}" 
                       alt="WolfJobs Logo"
                       width="200px" 
                       padding="10px 0" />
            </mj-column>
          </mj-section>

          <mj-section background-color="#356cc9" padding="0">
            <mj-column>
              <mj-text align="center" 
                      color="#ABCDEA"
                      font-size="13px" 
                      padding="28px 25px 18px">
                HELLO
                <br />
                <p style="font-size:16px; color:white; margin: 0">${firstName}</p>
              </mj-text>
            </mj-column>
          </mj-section>

          <mj-section background-color="#356cc7" padding="0 0 5px">
            <mj-column>
              <mj-divider border-color="#ffffff" 
                         border-width="2px" 
                         padding="0 20px" />
              <mj-text align="center" 
                      color="#FFF" 
                      padding="28px 25px">
                <span style="font-size:20px; font-weight:bold; ">Here is your One Time Password</span>
                <br /><br />
                <span style="font-size:15px; ">The below OTP will expire in 10 mins</span>
                <p style="font-size:16px; color:white; margin: 10px 0">${otp}</p>
              </mj-text>
            </mj-column>
          </mj-section>

          <mj-section background-color="#356cc7" padding="0 0 5px">
            <mj-column>
              <mj-divider border-color="#ffffff" 
                         border-width="2px" 
                         padding="0 20px" />
              <mj-text align="center" 
                      color="#FFF" 
                      padding="20px 25px">
                Best,
                <br /><br />
                <span style="font-size:15px">Team WolfJobs</span>
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-wrapper>
      </mj-body>
    </mjml>`;

    const htmlOutput = mjml(mjmlTemplate);
    
    if (htmlOutput.errors && htmlOutput.errors.length) {
      console.error('MJML compilation errors:', htmlOutput.errors);
      throw new Error('Failed to compile email template');
    }
    
    return htmlOutput.html;
  } catch (error) {
    console.error('Error generating email template:', error);
    return `
      <html>
        <body>
          <h1>Hello ${firstName}</h1>
          <p>Your OTP is: ${otp}</p>
          <p>This OTP will expire in 10 minutes.</p>
          <p>Best regards,<br>Team WolfJobs</p>
        </body>
      </html>
    `;
  }
};

module.exports = { generateOTPEmailTemplate }; 