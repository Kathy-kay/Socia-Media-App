import { convertFileToUrl } from '@/lib/utils';
import  {useCallback, useState} from 'react'
import { FileWithPath, useDropzone } from "react-dropzone";


type ProfileUploaderProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string;
  };

function ProfileUploader({fieldChange, mediaUrl}: ProfileUploaderProps) {
    const [file, setFile] = useState<File[]>([])
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl)

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    // Do something with the files
    setFile(acceptedFiles);
    fieldChange(acceptedFiles);
    setFileUrl(convertFileToUrl(acceptedFiles[0]))
  }, [file])


  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept:{
        "image/*": [".png", ".jpg", ".jpeg"]
    }
    })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} className='cursor-pointer'/>
      {
       <div className="cursor-pointer flex-center gap-4">
        <img src={fileUrl || "/assets/icons/profile-placeholder.svg"} 
        alt="images" 
        className='h-24 w-24 rounded-full object-cover object-top'
        />
        <p className="text-primary-500 small-regular md:bbase-semibold">
          Change profile photo
        </p>
       </div>
      }
    </div>
  )
}
export default ProfileUploader;