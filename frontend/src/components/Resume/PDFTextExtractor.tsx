// frontend/src/components/Resume/PDFTextExtractor.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { pdfjs } from "react-pdf";
import axios from "axios";

interface SkillPoint {
  title: string;
  skills: string[];
}


const PDFTextExtractor: React.FC = () => {
  const { applicantId,_id } = useParams();
  console.log("This is the job Id",_id);
  const [pdfText, setPdfText] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [textdisplay,setTextDisplay]=useState<string | null>(null);
  const [jobDetails,setJobDetails]=useState<string | null>(null);
  const [parsedSkills, setParsedSkills] = useState<{
    technical: SkillPoint[];
    nonTechnical: SkillPoint[];
  } | null>(null);


  useEffect(() => {
    async function getResume() {
      try {
        const response = await axios.get(
          `http://localhost:8000/users/applicantresume/${applicantId}`,
          {
            responseType: "blob",
          }
        );
        console.log(response.data);
        const resumeBlobUrl = URL.createObjectURL(response.data);
        console.log("This is the response",response);
        setResumeUrl(resumeBlobUrl);
      } catch (error) {
        console.error("Error fetching resume", error);
      }
    }
    getResume();
  }, [applicantId]);

  // useEffect(() => {
  //   async function getResume() {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:8000/`,
  //         {
  //           responseType: "blob",
  //         }
  //       );
  //       console.log(response.data);
  //       const resumeBlobUrl = URL.createObjectURL(response.data);
  //       console.log("This is the response",response);
  //       setResumeUrl(resumeBlobUrl);
  //     } catch (error) {
  //       console.error("Error fetching resume", error);
  //     }
  //   }
  //   getResume();
  // }, [_id]);


  useEffect(() => {
    const extractTextFromPDF = async (url: string) => {
      const loadingTask = pdfjs.getDocument(url);
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      let textContent = "";

      for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const textContentPage = await page.getTextContent();
        const textItems = textContentPage.items;

        textItems.forEach((item: any) => {
          textContent += item.str + " ";
        });
        // const textArray = textContent.split(/[\s|.,]+/).filter(Boolean);
        // console.log(textArray)
      }

      setPdfText(textContent);
    };

    if (resumeUrl) {
      extractTextFromPDF(resumeUrl);
    }
  }, [resumeUrl]);

  useEffect(() => {
    async function pushdata() {
      try {
        let result = await fetch("http://localhost:3002/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: pdfText }),
        });
        let finalresult = await result.json();
        
        console.log("Raw AI response:", finalresult);
  
        if (finalresult?.message) {
          setTextDisplay(finalresult.message);
          
          try {
            // Parse technical skills (keep existing parsing)
            const technicalSection = finalresult.message.split('Technical Skills:')[1];
            const technicalText = technicalSection.split('Non-Technical Skills:')[0];
            const technicalSkills = technicalText
  .trim()
  .split('\n')
  .filter(Boolean)
  .filter(point => {
    // Only include points that start with a number between 1-3 followed by a dot
    return /^[1-3]\.\s/.test(point);
  })
  .map(point => {
    if (!point.includes(':')) {
      return { title: point.substring(2).trim(), skills: [] };
    }
    const [title, skillsText] = point.substring(2).split(':');
    return {
      title: title.trim(),
      skills: skillsText ? skillsText.split(',').map(skill => skill.trim()) : []
    };
  });
  
            // Modified parsing for non-technical skills
            const nonTechnicalText = finalresult.message.split('Non-Technical Skills:')[1];
            const nonTechnicalSkills = nonTechnicalText
              .trim()
              .split('\n')
              .filter(Boolean)
              .map(point => {
                // Remove the number and dot at the start (e.g., "1. ")
                const description = point.replace(/^\d+\.\s*/, '').trim();
                return {
                  title: '', // We don't need a title for non-technical skills
                  skills: [description] // Store the entire description as a skill
                };
              });
  
            console.log('Parsed Technical Skills:', technicalSkills);
            console.log('Parsed Non-Technical Skills:', nonTechnicalSkills);
  
            setParsedSkills({
              technical: technicalSkills,
              nonTechnical: nonTechnicalSkills
            });
          } catch (parseError) {
            console.error('Error parsing skills:', parseError);
          }
        }
      } catch (error) {
        console.error("Error sending text to backend:", error);
      }
    }
  
    if (pdfText) {
      pushdata();
    }
  }, [pdfText]);

  return (
    <div className="mt-4 p-6 max-w-4xl mx-auto">
      {parsedSkills && (
        <div className="space-y-8">
          {/* Technical Skills Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-600 mb-6 pb-2 border-b border-blue-200">
              Technical Skills
            </h2>
            <div className="space-y-6">
              {parsedSkills.technical.map((point, index) => (
                <div key={index} className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1 flex-shrink-0">
                      {index + 1}
                    </span>
                    {point.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 ml-9">
                    {point.skills.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Non-Technical Skills Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-bold text-green-600 mb-6 pb-2 border-b border-green-200">
              Non-Technical Skills
            </h2>
            <div className="space-y-6">
              {parsedSkills.nonTechnical.map((point, index) => (
                <div key={index} className="ml-4">
                  <div className="flex items-start">
                    <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{point.skills[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFTextExtractor;