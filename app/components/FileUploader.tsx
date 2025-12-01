import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

interface FileUploaderProps{
    onFileSelect?: (file: File | null) => void;
}

// Function to format file size in human readable format
const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileUploader = ({onFileSelect}: FileUploaderProps) => {
    const [localFile, setLocalFile] = useState<File | null>(null);
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        console.log('Files dropped:', acceptedFiles);
        // Handle file upload
        const file = acceptedFiles[0] || null;
        setLocalFile(file);
        onFileSelect?.(file);

    }, [onFileSelect]);

    const onDropRejected = useCallback((fileRejections: any[]) => {
        console.log('Files rejected:', fileRejections);
        fileRejections.forEach((rejection) => {
            const { file, errors } = rejection;
            console.log(`File ${file.name} rejected:`, errors);
        });
    }, []);

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLocalFile(null);
        onFileSelect?.(null);
    };

    const {getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections} = useDropzone({
        onDrop,
        onDropRejected,
        multiple: false,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxSize: 20 * 1024 * 1024, // 20 MB
        noClick: false,
        noKeyboard: false,
        disabled: false
    });
    
    // Use local state file instead of acceptedFiles for better control
    const file = localFile;
    
    // Debug logging
    React.useEffect(() => {
        console.log('Dropzone state:', { isDragActive, acceptedFiles: acceptedFiles.length, rejectedFiles: fileRejections.length });
        if (fileRejections.length > 0) {
            console.log('Rejected files:', fileRejections);
        }
    }, [isDragActive, acceptedFiles, fileRejections]);

  return (
    <div className='w-full'>
        <div 
            {...getRootProps()}
            className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
                ${isDragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                }
            `}
        >
            <input {...getInputProps()} />
            
            <div className='space-y-4'>
                {!file && !isDragActive && (
                    <div className='mx-auto w-16 h-16 flex items-center justify-center'>
                        <img src="/icons/info.svg" alt="upload" className='size-16' />
                    </div>
                )}
                
                {file ?(
                    <div className='flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg relative'>
                        <button
                            onClick={removeFile}
                            className='absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors'
                            title="Remove file"
                        >
                            <img src="/icons/cross.svg" alt="remove" className='w-3 h-3 filter invert' />
                        </button>
                        <div className='flex items-center space-x-4'>
                            <div className='flex-shrink-0'>
                                <img 
                                    src="/images/pdf.png" 
                                    alt="pdf" 
                                    className='w-12 h-12 cursor-pointer hover:scale-105 transition-transform' 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const url = URL.createObjectURL(file);
                                        window.open(url, '_blank');
                                    }}
                                />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='text-sm font-medium text-gray-900 truncate'>
                                    {file.name}
                                </p>
                                <p className='text-sm text-gray-500'>
                                    {formatSize(file.size)}
                                </p>
                            </div>
                            <div className='flex-shrink-0'>
                                <div className='flex items-center space-x-1'>
                                    <img src="/icons/check.svg" alt="success" className='w-5 h-5' />
                                    <span className='text-sm font-medium text-green-600'>Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ):(
                    <div>
                        {isDragActive ? (
                            <div>
                                <p className='text-xl text-blue-600 font-semibold mb-2'>
                                    Drop your PDF file here
                                </p>
                                <p className='text-blue-500'>Release to upload</p>
                            </div>
                        ) : (
                            <div>
                                <p className='text-lg text-gray-600 mb-2'>
                                    <span className='font-semibold text-gray-800'>Click to upload</span>
                                    {' '}or drag and drop
                                </p>
                                <p className='text-sm text-gray-500'>PDF files only (max 20 MB)</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default FileUploader
