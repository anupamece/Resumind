import React, { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router';
import FileUploader from '~/components/FileUploader';
import Navbar from '~/components/Navbar'
import { usePuterStore } from '~/lib/puter';
import { convertPdfToImage } from '~/lib/pdf2image';
import { generateUUID } from '~/lib/utils';
import { prepareInstructions } from 'constants/index';


const Upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file,setfile]=useState<File | null>(null);
    const {auth ,isLoading,fs,ai,kv}=usePuterStore();
    const navigate=useNavigate();

    // Check authentication status
    React.useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate('/auth?next=/upload');
        }
    }, [auth.isAuthenticated, isLoading, navigate]);

    const handleAnalyze= async({companyName,jobTitle,jobDescription,file}:{companyName:string,jobTitle:string,jobDescription:string,file:File})=>{
        try {
            setIsProcessing(true);
            setStatusText('Uploading file...');
            
            const uploadedFile=await fs.upload([file]);
            if(!uploadedFile) {
                throw new Error('Failed to upload file to storage');
            }
            console.log('File uploaded successfully:', uploadedFile.path);

            setStatusText('Converting PDF to image...');
            
            const imageResult = await convertPdfToImage(file);
            
            // Check for conversion errors
            if(imageResult.error || !imageResult.file) {
                console.error('PDF conversion failed:', imageResult.error);
                throw new Error(imageResult.error || 'Failed to convert PDF to image');
            }
            
            console.log('PDF converted to image successfully');
            setStatusText('Uploading image...');
            
            const uploadedImage= await fs.upload([imageResult.file]);
            if(!uploadedImage) {
                throw new Error('Failed to upload converted image');
            }
            console.log('Image uploaded successfully:', uploadedImage.path);

            setStatusText("Preparing data...");

            const uuid= generateUUID();

            const data={
                id: uuid,
                resumePath:uploadedFile.path,
                imagePath:uploadedImage.path,
                companyName,
                jobTitle, 
                jobDescription,
                feedback:'',
            }

            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            console.log('Data saved to KV store with ID:', uuid);
            
            setStatusText('Analyzing resume with AI...');

            const feedback= await ai.feedback(
                uploadedFile.path,
                prepareInstructions({jobTitle,jobDescription})
            );
            
            if(!feedback) {
                throw new Error('AI analysis failed - no response received');
            }

            const feedbackText= typeof feedback.message.content ==='string' ? feedback.message.content 
            :feedback.message.content[0].text ;

            try {
                data.feedback=JSON.parse(feedbackText);
            } catch (parseError) {
                console.error('Failed to parse AI feedback:', parseError);
                throw new Error('AI returned invalid response format');
            }
            
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText('Analysis complete!');
            console.log('Analysis completed successfully:', data);
            navigate(`/resume/${uuid}`);
            
            // Navigate to results page after short delay
            // setTimeout(() => {
            //     navigate(`/results/${uuid}`);
            // }, 2000);
            // console.log(data);
            
        } catch (error) {
            console.error('Analysis failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setStatusText(`Error: ${errorMessage}`);
            
            // Reset processing state after showing error
            setTimeout(() => {
                setIsProcessing(false);
                setStatusText('');
            }, 5000);
        }
    }


    const handleSubmit =(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        
        try {
            const form =e.currentTarget.closest('form');
            if(!form) {
                alert('Form not found');
                return;
            }
            
            const formData = new FormData(form);

            const companyName = formData.get('company-name') as string;
            const jobTitle = formData.get('job-title') as string;
            const jobDescription = formData.get('job-description') as string;

            // Validate form inputs
            if (!companyName?.trim()) {
                alert('Please enter a company name');
                return;
            }
            
            if (!jobTitle?.trim()) {
                alert('Please enter a job title');
                return;
            }
            
            if (!jobDescription?.trim()) {
                alert('Please enter a job description');
                return;
            }

            if(!file) {
                alert('Please upload a PDF file');
                return;
            }

            // Validate file type
            if (file.type !== 'application/pdf') {
                alert('Please upload a valid PDF file');
                return;
            }

            console.log('Form submission:', { companyName, jobTitle, jobDescription, fileName: file.name });
            handleAnalyze({companyName, jobTitle, jobDescription, file});
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Error submitting form. Please try again.');
        }
    }


    const handleFileSelect =(file:File | null)=>{
        console.log('File selected in Upload component:', file ? file.name : 'null');
        setfile(file);
    }
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />
      <section className="main-section">
        <div className='page-heading py-16 '>
            <h1>Smart Feedbacks for your job Joruney!</h1>
            {isProcessing ?(
                <>
                <h2>{statusText}</h2>
                <img src="/images/resume-scan.gif" alt="" 
                className='w-full'/>
                </>
            ):(
                <h2>Drop Your Resume for ATS score and improvement insights</h2>
            )} 
            {!isProcessing && (
                <form id='upload-form' onSubmit={handleSubmit}
                className='flex flex-col gap-4 mt-8'>
                    <div className='form-div'>
                        <label htmlFor="company-name"></label>
                        <input type="text" name='company-name' placeholder='Company Name' id='company-name' /> 
                    </div>
                    <div className='form-div'>
                        <label htmlFor="job-title"></label>
                        <input type="text" name='job-title' placeholder='Job Title' id='job-title' />
                        
                    </div>
                    <div className='form-div'>
                        <label htmlFor="job-description"></label>
                        <textarea rows={5} name='job-description' placeholder='Job Description' id='job-description' />
                        
                    </div>
                    <div className='form-div'>
                        <label htmlFor="uploader">Upload Your Resume</label>
                        <FileUploader onFileSelect={handleFileSelect} />
                    </div>
                    <button className='primary-button'type='submit'>Analyze</button>
                </form> 
            )}
        </div>

      </section>
    </main>
  )
};

export default Upload;
